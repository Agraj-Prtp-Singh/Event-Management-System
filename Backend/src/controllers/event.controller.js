const eventService = require('../services/event.service');
const { validateEventPayload, validateReviewPayload } = require('../validators/event.validator');
const asyncHandler = require('../utils/asyncHandler');
const HTTP_STATUS = require('../constants/httpStatus');

const createEvent = asyncHandler(async (req, res) => {
  validateEventPayload(req.body);
  const event = await eventService.createEvent(req.body, req.user);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Event created successfully',
    data: event
  });
});

const listEvents = asyncHandler(async (req, res) => {
  const data = await eventService.listEvents(req.query);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Events fetched successfully',
    data
  });
});

const getEventById = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Event fetched successfully',
    data: event
  });
});

const updateEvent = asyncHandler(async (req, res) => {
  validateEventPayload(req.body, true);
  const event = await eventService.updateEvent(req.params.id, req.body, req.user);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Event updated successfully',
    data: event
  });
});

const deleteEvent = asyncHandler(async (req, res) => {
  await eventService.deleteEvent(req.params.id, req.user);

  res.status(HTTP_STATUS.NO_CONTENT).send();
});

const listEventRegistrations = asyncHandler(async (req, res) => {
  const registrations = await eventService.listEventRegistrations(req.params.id, req.user);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Registrations fetched successfully',
    data: registrations
  });
});

const listPendingEvents = asyncHandler(async (req, res) => {
  const data = await eventService.listPendingEvents(req.query);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Pending events fetched successfully',
    data
  });
});

const reviewEvent = asyncHandler(async (req, res) => {
  validateReviewPayload(req.body);
  const event = await eventService.reviewEvent(
    req.params.id,
    req.body.decision,
    req.user.id,
    req.body.denialReason
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: `Event ${req.body.decision.toLowerCase()} successfully`,
    data: event
  });
});

module.exports = {
  createEvent,
  listEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  listEventRegistrations,
  listPendingEvents,
  reviewEvent
};
