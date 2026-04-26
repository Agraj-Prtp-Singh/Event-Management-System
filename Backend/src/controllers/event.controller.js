const eventService = require('../services/event.service');
const asyncHandler = require('../utils/asyncHandler');
const HTTP_STATUS = require('../constants/httpStatus');

exports.createEvent = asyncHandler(async (req, res) => {
  const event = await eventService.createEvent(req.body, req.user);
  res.status(HTTP_STATUS.CREATED).json({ success: true, data: event });
});

exports.updateEvent = asyncHandler(async (req, res) => {
  const event = await eventService.updateEvent(req.params.id, req.body, req.user);
  res.status(HTTP_STATUS.OK).json({ success: true, data: event });
});

exports.deleteEvent = asyncHandler(async (req, res) => {
  await eventService.deleteEvent(req.params.id, req.user);
  res.status(HTTP_STATUS.OK).json({ success: true, message: 'Event deleted' });
});

exports.getEventById = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);
  res.status(HTTP_STATUS.OK).json({ success: true, data: event });
});

exports.listEvents = asyncHandler(async (req, res) => {
  const events = await eventService.listEvents(req.query);
  res.status(HTTP_STATUS.OK).json({ success: true, data: events });
});

exports.listEventRegistrations = asyncHandler(async (req, res) => {
  const registrations = await eventService.listEventRegistrations(req.params.id);
  res.status(HTTP_STATUS.OK).json({ success: true, data: registrations });
});