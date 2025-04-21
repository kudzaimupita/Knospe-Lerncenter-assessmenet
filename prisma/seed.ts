/* eslint-disable prettier/prettier */
// Seed script for creating 25 patient records
//@ts-nocheck

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed patients...');

  // Array of blood types
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Array of possible medical conditions
  const conditions = [
    'Hypertension',
    'Diabetes Type 2',
    'Asthma',
    'Arthritis',
    'Coronary Heart Disease',
    'COPD',
    'Depression',
    'Anxiety',
    'Hypothyroidism',
    'Allergic Rhinitis',
    'None'
  ];

  // Array of possible allergies
  const allergies = [
    'Penicillin',
    'Peanuts',
    'Latex',
    'Shellfish',
    'Dairy',
    'Pollen',
    'Dust Mites',
    'Mold',
    'Insect Stings',
    'None'
  ];

  // Array of possible medications
  const medications = [
    'Lisinopril',
    'Metformin',
    'Albuterol',
    'Atorvastatin',
    'Levothyroxine',
    'Amlodipine',
    'Omeprazole',
    'Simvastatin',
    'Losartan',
    'None'
  ];

  // Array of insurance providers
  const insuranceProviders = [
    'Aetna',
    'Blue Cross Blue Shield',
    'Cigna',
    'UnitedHealthcare',
    'Humana',
    'Kaiser Permanente',
    'Medicare',
    'Medicaid',
    'Anthem',
    'Self-Pay'
  ];

  // Function to generate random date between two dates
  const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  // Function to get random element from array
  const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

  // Function to get 1-3 random conditions/allergies/medications
  const getRandomItems = (array) => {
    const count = Math.floor(Math.random() * 3) + 1;
    const items = [];
    for (let i = 0; i < count; i++) {
      const item = getRandomElement(array);
      if (!items.includes(item) && item !== 'None') {
        items.push(item);
      }
    }
    return items.length ? items.join(', ') : 'None';
  };

  // Create 25 patients
  for (let i = 1; i <= 25; i++) {
    // Format number with leading zeros
    const patientNum = i.toString().padStart(3, '0');

    // Random date of birth between 1950 and 2000
    const dob = randomDate(new Date(1950, 0, 1), new Date(2000, 11, 31));

    // Random last visit date in the past 2 years
    const lastVisit = Math.random() > 0.2 ? randomDate(new Date(2023, 0, 1), new Date()) : null;

    // Create patient with randomized data
    await prisma.patient.create({
      data: {
        email: `patient${patientNum}@example.com`,
        name: `Patient ${patientNum}`,
        password: await hash('Password123', 10), // Encrypt password
        role: 'USER',
        isEmailVerified: Math.random() > 0.3, // 70% verified
        insuranceProvider: getRandomElement(insuranceProviders),
        insuranceNumber: `INS-${Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, '0')}`,
        dateOfBirth: dob,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        phone: `+1${Math.floor(Math.random() * 1000000000)
          .toString()
          .padStart(10, '0')}`,
        address: `${Math.floor(Math.random() * 9000) + 1000} Main St, City, State ${
          Math.floor(Math.random() * 90000) + 10000
        }`,
        bloodType: getRandomElement(bloodTypes),
        allergies: getRandomItems(allergies),
        conditions: getRandomItems(conditions),
        medications: getRandomItems(medications),
        lastVisit
      }
    });

    console.log(`Created patient ${i} of 25`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding patients:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
