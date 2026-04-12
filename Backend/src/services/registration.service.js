const jwt = require('jsonwebtoken');
const env = require('../config/env');
const eventRepository = require('../repositories/event.repository');
const registrationRepository = require('../repositories/registration.repository');
const AppError = require('../utils/appError');
const HTTP_STATUS = require('../constants/httpStatus');

class RegistrationService {
  async registerForEvent(eventId, userId) {
    const event = await eventRepository.findById(eventId);

    if (!event || !event.isPublished) {
      throw new AppError('Event not found', HTTP_STATUS.NOT_FOUND);
    }

    if (new Date(event.endDate) < new Date()) {
      throw new AppError('Event registration is closed', HTTP_STATUS.BAD_REQUEST);
    }

    const existing = await registrationRepository.findOne({ eventId, userId });
    if (existing && existing.status === 'registered') {
      throw new AppError('You are already registered for this event', HTTP_STATUS.CONFLICT);
    }

    const registeredCount = await registrationRepository.countByEvent(eventId);
    if (registeredCount >= event.capacity) {
      throw new AppError('Event is full', HTTP_STATUS.CONFLICT);
    }

    if (existing && existing.status === 'cancelled') {
      existing.status = 'registered';
      await existing.save();
      return existing;
    }

    return registrationRepository.create({ eventId, userId });
  }

  async cancelRegistration(eventId, userId) {
    const updated = await registrationRepository.cancel(userId, eventId);

    if (!updated) {
      throw new AppError('Active registration not found', HTTP_STATUS.NOT_FOUND);
    }

    return updated;
  }

  async listMyRegistrations(userId) {
    const registrations = await registrationRepository.listByUser(userId);
    return registrations.map((registration) => this.#serializeRegistrationWithTicket(registration, userId));
  }

  async scanTicketForEventDetails(ticketToken, userId) {
    let decodedTicket;

    try {
      decodedTicket = jwt.verify(ticketToken, env.jwtSecret);
    } catch (error) {
      throw new AppError('Invalid or expired ticket QR code', HTTP_STATUS.BAD_REQUEST);
    }

    if (decodedTicket.typ !== 'event_ticket' || !decodedTicket.rid) {
      throw new AppError('Invalid ticket QR code payload', HTTP_STATUS.BAD_REQUEST);
    }

    const registration = await registrationRepository.findActiveByIdAndUser(decodedTicket.rid, userId);
    if (!registration) {
      throw new AppError('Ticket not found for this user', HTTP_STATUS.NOT_FOUND);
    }

    return this.#serializeRegistrationWithTicket(registration, userId);
  }

  #serializeRegistrationWithTicket(registration, userId) {
    const safeRegistration = registration.toObject
      ? registration.toObject({ virtuals: true })
      : registration;
    const event = safeRegistration.eventId;
    const eventId = event && event._id ? String(event._id) : String(safeRegistration.eventId);
    const registrationId = String(safeRegistration._id);
    const qrPayload = this.#buildTicketToken({
      registrationId,
      eventId,
      userId,
      eventEndDate: event && event.endDate
    });

    return {
      ...safeRegistration,
      ticket: {
        type: 'event_ticket',
        qrPayload
      }
    };
  }

  #buildTicketToken({ registrationId, eventId, userId, eventEndDate }) {
    return jwt.sign(
      {
        typ: 'event_ticket',
        rid: registrationId,
        eid: eventId,
        uid: userId
      },
      env.jwtSecret,
      {
        expiresIn: this.#resolveTicketExpiry(eventEndDate)
      }
    );
  }

  #resolveTicketExpiry(eventEndDate) {
    if (!eventEndDate) {
      return '30d';
    }

    const eventEndMillis = new Date(eventEndDate).getTime();
    if (Number.isNaN(eventEndMillis)) {
      return '30d';
    }

    const now = Date.now();
    const minLifetimeSeconds = 60 * 30;
    const eventLifetimeSeconds = Math.ceil((eventEndMillis - now) / 1000);

    return Math.max(eventLifetimeSeconds, minLifetimeSeconds);
  }
}

module.exports = new RegistrationService();
