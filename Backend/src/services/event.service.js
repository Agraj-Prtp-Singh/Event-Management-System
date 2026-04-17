const eventRepo = require('../repositories/event.repository');
const AppError = require('../utils/appError');

exports.createEvent = async (data, user) => {
  data.createdBy = user.id;
  return await eventRepo.create(data);
};

exports.updateEvent = async (eventId, data, user) => {
  const event = await eventRepo.findById(eventId);
  if (!event) throw new AppError('Event not found', 404);

  if (event.createdBy.toString() !== user.id) {
    throw new AppError('Unauthorized', 403);
  }

  return await eventRepo.update(eventId, data);
};

exports.deleteEvent = async (eventId, user) => {
  const event = await eventRepo.findById(eventId);
  if (!event) throw new AppError('Event not found', 404);

  if (event.createdBy.toString() !== user.id) {
    throw new AppError('Unauthorized', 403);
  }

  return await eventRepo.delete(eventId);
};

exports.getEventById = async (id) => {
  return await eventRepo.findById(id);
};

exports.listEvents = async (query) => {
  return await eventRepo.findAll(query);
};
const HTTP_STATUS = require('../constants/httpStatus');
const { ROLES } = require('../constants/roles');

class EventService {
  async createEvent(payload, userId) {
    const event = await eventRepository.create({
      ...payload,
      createdBy: userId
    });

    return event;
  }

  async listEvents(query) {
    const pagination = sanitizePagination(query);
    const filter = { isPublished: true };

    if (query.search && query.search.trim()) {
      filter.$text = { $search: query.search.trim() };
    }

    if (query.fromDate || query.toDate) {
      filter.startDate = {};
      if (query.fromDate) filter.startDate.$gte = new Date(query.fromDate);
      if (query.toDate) filter.startDate.$lte = new Date(query.toDate);
    }

    const [items, total] = await Promise.all([
      eventRepository.list(filter, pagination),
      eventRepository.count(filter)
    ]);

    return {
      items,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit)
      }
    };
  }

  async listEventsByPlanner(plannerId, query) {
    const pagination = sanitizePagination(query);
    const filter = { createdBy: plannerId };

    if (query.search && query.search.trim()) {
      filter.$text = { $search: query.search.trim() };
    }

    if (query.fromDate || query.toDate) {
      filter.startDate = {};
      if (query.fromDate) filter.startDate.$gte = new Date(query.fromDate);
      if (query.toDate) filter.startDate.$lte = new Date(query.toDate);
    }

    const [items, total] = await Promise.all([
      eventRepository.list(filter, pagination),
      eventRepository.count(filter)
    ]);

    return {
      items,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit)
      }
    };
  }

  async getPlannerStats(plannerId) {
    const eventCount = await eventRepository.count({ createdBy: plannerId });
    const totalCapacity = await eventRepository.sumCapacityByOwner(plannerId);

    const eventIds = await eventRepository.listIdsByOwner(plannerId);
    const ids = eventIds.map((event) => event._id);
    const attendeeCount = ids.length ? await registrationRepository.countByEventIds(ids) : 0;
    const fillRate = totalCapacity > 0 ? Math.round((attendeeCount / totalCapacity) * 100) : 0;

    return {
      totalEvents: eventCount,
      totalAttendees: attendeeCount,
      totalCapacity,
      fillRate,
      revenue: 0
    };
  }

  async listPlannerAttendees(plannerId) {
    const eventIds = await eventRepository.listIdsByOwner(plannerId);
    const ids = eventIds.map((event) => event._id);

    if (ids.length === 0) {
      return [];
    }

    return registrationRepository.listByEventIds(ids);
  }

  async getEventById(eventId) {
    const event = await eventRepository.findByIdWithCreator(eventId);

    if (!event || !event.isPublished) {
      throw new AppError('Event not found', HTTP_STATUS.NOT_FOUND);
    }

    return event;
  }

  async updateEvent(eventId, payload, user) {
    const existingEvent = await eventRepository.findById(eventId);

    if (!existingEvent) {
      throw new AppError('Event not found', HTTP_STATUS.NOT_FOUND);
    }

    const isOwner = String(existingEvent.createdBy) === user.id;
    const isAdmin = user.role === ROLES.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new AppError('Only owner or admin can update this event', HTTP_STATUS.FORBIDDEN);
    }

    const updated = await eventRepository.updateById(eventId, payload);
    return updated;
  }

  async deleteEvent(eventId, user) {
    const existingEvent = await eventRepository.findById(eventId);

    if (!existingEvent) {
      throw new AppError('Event not found', HTTP_STATUS.NOT_FOUND);
    }

    const isOwner = String(existingEvent.createdBy) === user.id;
    const isAdmin = user.role === ROLES.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new AppError('Only owner or admin can delete this event', HTTP_STATUS.FORBIDDEN);
    }

    await eventRepository.deleteById(eventId);
    return true;
  }

  async listEventRegistrations(eventId, user) {
    const event = await eventRepository.findById(eventId);

    if (!event) {
      throw new AppError('Event not found', HTTP_STATUS.NOT_FOUND);
    }

    const isOwner = String(event.createdBy) === user.id;
    const isAdmin = user.role === ROLES.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new AppError('Only owner or admin can view registrations', HTTP_STATUS.FORBIDDEN);
    }

    return registrationRepository.listByEvent(eventId);
  }
}

module.exports = new EventService();
