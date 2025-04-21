/* eslint-disable prettier/prettier */

import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import { patientService } from '../services';
import pick from '../utils/pick';

const createPatient = catchAsync(async (req, res) => {
  const { email, password, name, role } = req.body;
  const patient = await patientService.createPatient(email, password, name, role);
  res.status(httpStatus.CREATED).send(patient);
});

const getPatients = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await patientService.queryPatients(filter, options);
  res.send(result);
});

const getPatient = catchAsync(async (req, res) => {
  const patient = await patientService.getPatientById(req.params.patientId);
  if (!patient) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Patient not found');
  }
  res.send(patient);
});

const updatePatient = catchAsync(async (req, res) => {
  const patient = await patientService.updatePatientById(req.params.patientId, req.body);
  res.send(patient);
});

const deletePatient = catchAsync(async (req, res) => {
  await patientService.deletePatientById(req.params.patientId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient
};
