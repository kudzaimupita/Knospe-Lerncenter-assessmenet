/* eslint-disable prettier/prettier */

import auth from '../../middlewares/auth';
import express from 'express';
import { patientController } from '../../controllers';
import { patientValidation } from '../../validations';
import validate from '../../middlewares/validate';

const router = express.Router();

router
  .route('/')
  .post(
    auth('managePatients'),
    validate(patientValidation.createPatient),
    patientController.createPatient
  )
  .get(auth('getPatients'), validate(patientValidation.getPatients), patientController.getPatients);

router
  .route('/:patientId')
  .get(auth('getPatients'), validate(patientValidation.getPatient), patientController.getPatient)
  .patch(
    auth('managePatients'),
    validate(patientValidation.updatePatient),
    patientController.updatePatient
  )
  .delete(
    auth('managePatients'),
    validate(patientValidation.deletePatient),
    patientController.deletePatient
  );

export default router;

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient management and retrieval
 */

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Create a patient
 *     description: Only users with proper permissions can create patients.
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *               role:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               phone:
 *                 type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *               insuranceProvider:
 *                 type: string
 *               insuranceNumber:
 *                 type: string
 *               bloodType:
 *                 type: string
 *                 enum: [A+, A-, B+, B-, AB+, AB-, O+, O-]
 *               allergies:
 *                 type: array
 *                 items:
 *                   type: string
 *               conditions:
 *                 type: array
 *                 items:
 *                   type: string
 *               medications:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     dosage:
 *                       type: string
 *                     frequency:
 *                       type: string
 *               lastVisit:
 *                 type: string
 *                 format: date
 *             example:
 *               name: John Smith
 *               email: john.smith@email.com
 *               password: password123
 *               dateOfBirth: 1975-05-12
 *               gender: Male
 *               phone: 555-123-4567
 *               address:
 *                 street: 123 Main St
 *                 city: Springfield
 *                 state: IL
 *                 zipCode: 62704
 *               insuranceProvider: Blue Cross
 *               insuranceNumber: BC987654321
 *               bloodType: A+
 *               allergies: [Penicillin, Peanuts]
 *               conditions: [Hypertension, Type 2 Diabetes]
 *               medications:
 *                 - name: Lisinopril
 *                   dosage: 10mg
 *                   frequency: Daily
 *                 - name: Metformin
 *                   dosage: 500mg
 *                   frequency: Twice daily
 *               lastVisit: 2025-01-15
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Patient'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all patients
 *     description: Only users with proper permissions can retrieve all patients.
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Patient name
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Patient role
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *         description: Patient gender
 *       - in: query
 *         name: insuranceProvider
 *         schema:
 *           type: string
 *         description: Insurance provider
 *       - in: query
 *         name: bloodType
 *         schema:
 *           type: string
 *         description: Blood type
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of patients
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Patient'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get a patient
 *     description: Get patient information by ID. Only users with proper permissions can access.
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Patient'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a patient
 *     description: Update patient information. Only users with proper permissions can update.
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *               insuranceProvider:
 *                 type: string
 *               insuranceNumber:
 *                 type: string
 *               bloodType:
 *                 type: string
 *               allergies:
 *                 type: array
 *                 items:
 *                   type: string
 *               conditions:
 *                 type: array
 *                 items:
 *                   type: string
 *               medications:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     dosage:
 *                       type: string
 *                     frequency:
 *                       type: string
 *               lastVisit:
 *                 type: string
 *                 format: date
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Patient'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a patient
 *     description: Delete a patient. Only users with proper permissions can delete.
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient id
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
