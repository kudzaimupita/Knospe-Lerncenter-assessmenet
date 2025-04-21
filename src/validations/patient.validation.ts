/* eslint-disable prettier/prettier */

import Joi from 'joi';
import { password } from './custom.validation';

const createPatient = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string(),
    dateOfBirth: Joi.date(),
    gender: Joi.string().valid('Male', 'Female', 'Other'),
    phone: Joi.string(),
    address: Joi.object().keys({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipCode: Joi.string()
    }),
    insuranceProvider: Joi.string(),
    insuranceNumber: Joi.string(),
    bloodType: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    allergies: Joi.array().items(Joi.string()),
    conditions: Joi.array().items(Joi.string()),
    medications: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        dosage: Joi.string().required(),
        frequency: Joi.string().required()
      })
    ),
    lastVisit: Joi.date()
  })
};

const getPatients = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    gender: Joi.string(),
    insuranceProvider: Joi.string(),
    bloodType: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getPatient = {
  params: Joi.object().keys({
    patientId: Joi.number().integer()
  })
};

const updatePatient = {
  params: Joi.object().keys({
    patientId: Joi.number().integer()
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      role: Joi.string(),
      dateOfBirth: Joi.date(),
      gender: Joi.string().valid('Male', 'Female', 'Other'),
      phone: Joi.string(),
      address: Joi.object().keys({
        street: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        zipCode: Joi.string()
      }),
      insuranceProvider: Joi.string(),
      insuranceNumber: Joi.string(),
      bloodType: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
      allergies: Joi.array().items(Joi.string()),
      conditions: Joi.array().items(Joi.string()),
      medications: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
          dosage: Joi.string().required(),
          frequency: Joi.string().required()
        })
      ),
      lastVisit: Joi.date()
    })
    .min(1)
};

const deletePatient = {
  params: Joi.object().keys({
    patientId: Joi.number().integer()
  })
};

export default {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient
};
