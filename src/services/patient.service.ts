/* eslint-disable prettier/prettier */

import { Patient, Prisma } from '@prisma/client';

import ApiError from '../utils/ApiError';
import { encryptPassword } from '../utils/encryption';
import httpStatus from 'http-status';
import prisma from '../client';

/**
 * Create a patient
 * @param {Object} patientData
 * @returns {Promise<Patient>}
 */
const createPatient = async (
  email: string,
  password: string,
  name?: string,
  role?: string
): Promise<Patient> => {
  if (await getPatientByEmail(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  // Create patient data with required fields
  const patientData: any = {
    email,
    name,
    password: await encryptPassword(password)
  };

  // Add role if provided
  if (role) {
    patientData.role = role;
  }

  return prisma.patient.create({
    data: patientData
  });
};

/**
 * Query for patients
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPatients = async <Key extends keyof Patient>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = [
    'id',
    'email',
    'name',
    'password',
    'role',
    'isEmailVerified',
    'createdAt',
    'updatedAt',
    'insuranceProvider',
    'insuranceNumber',
    'dateOfBirth',
    'gender',
    'phone',
    'address',
    'bloodType',
    'allergies',
    'conditions',
    'medications',
    'lastVisit'
  ] as Key[]
): Promise<Pick<Patient, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';

  const patients = await prisma.patient.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: (page - 1) * limit, // Fix pagination logic (page * limit -> (page - 1) * limit)
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  // Get total count for pagination
  const total = await prisma.patient.count({ where: filter });

  console.log(`Found ${patients.length} patients out of ${total} total`);
  return patients as Pick<Patient, Key>[];
};

/**
 * Get patient by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Patient, Key> | null>}
 */
const getPatientById = async <Key extends keyof Patient>(
  id: number,
  keys: Key[] = [
    'id',
    'email',
    'name',
    'role',
    'isEmailVerified',
    'createdAt',
    'updatedAt',
    'insuranceProvider',
    'insuranceNumber',
    'dateOfBirth',
    'gender',
    'phone',
    'address',
    'bloodType',
    'allergies',
    'conditions',
    'medications',
    'lastVisit'
  ] as Key[]
): Promise<Pick<Patient, Key> | null> => {
  return prisma.patient.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<Patient, Key> | null>;
};

/**
 * Get patient by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Patient, Key> | null>}
 */
const getPatientByEmail = async <Key extends keyof Patient>(
  email: string,
  keys: Key[] = [
    'id',
    'email',
    'name',
    'password',
    'role',
    'isEmailVerified',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<Patient, Key> | null> => {
  return prisma.patient.findUnique({
    where: { email },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<Patient, Key> | null>;
};

/**
 * Update patient by id
 * @param {ObjectId} patientId
 * @param {Object} updateBody
 * @returns {Promise<Patient>}
 */
const updatePatientById = async <Key extends keyof Patient>(
  patientId: number,
  updateBody: Prisma.PatientUpdateInput,
  keys: Key[] = [
    'id',
    'email',
    'name',
    'role',
    'insuranceProvider',
    'insuranceNumber',
    'dateOfBirth',
    'gender',
    'phone',
    'address',
    'bloodType',
    'allergies',
    'conditions',
    'medications',
    'lastVisit'
  ] as Key[]
): Promise<Pick<Patient, Key> | null> => {
  const patient = await getPatientById(patientId, ['id', 'email', 'name']);
  if (!patient) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Patient not found');
  }

  if (
    updateBody.email &&
    (await getPatientByEmail(updateBody.email as string)) &&
    (await getPatientByEmail(updateBody.email as string))?.id !== patientId
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  // Handle password encryption if it's being updated
  if (updateBody.password) {
    updateBody.password = await encryptPassword(updateBody.password as string);
  }

  const updatedPatient = await prisma.patient.update({
    where: { id: patient.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });

  return updatedPatient as Pick<Patient, Key> | null;
};

/**
 * Delete patient by id
 * @param {ObjectId} patientId
 * @returns {Promise<Patient>}
 */
const deletePatientById = async (patientId: number): Promise<Patient> => {
  const patient = await getPatientById(patientId);
  if (!patient) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Patient not found');
  }
  await prisma.patient.delete({ where: { id: patient.id } });
  return patient;
};

export default {
  createPatient,
  queryPatients,
  getPatientById,
  getPatientByEmail,
  updatePatientById,
  deletePatientById
};
