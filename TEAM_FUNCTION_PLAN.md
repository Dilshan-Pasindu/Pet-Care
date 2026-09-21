# PetCare — Team Function Development Plan

This document defines the functional development boundaries, technical deliverables, and viva defense topics for the university group project. Each section maps directly to a discrete area of responsibility in the codebase.

---

## Common Group Function — Authentication & User Management

### Objective
Provide secure authentication, role-based access control (RBAC), and user profile management shared by all team functions.

### Architecture
- **Backend Model:** `User` (`_id`, `name`, `email`, `password`, `phone`, `role`, `profileImage`)
- **Roles:** `owner`, `veterinarian`, `admin`
- **Backend Directory:** `backend/src/common/authentication/`
- **Frontend Directory:** `frontend/src/context/AuthContext.tsx`, `frontend/src/screens/auth/`
- **API Endpoints:**
  - `POST /api/auth/register` — Register a new account
  - `POST /api/auth/login` — Sign in and receive JWT
  - `GET /api/auth/me` — Retrieve authenticated user profile
  - `PUT /api/auth/profile` — Update user details / profile image
- **Viva Topics:** Password hashing algorithms (bcrypt), JWT payload signing, stateless authentication, Express middleware chaining, and AsyncStorage security.

---

## Function 1 — Pet Management

### Objective
Manage complete pet profiles, physical measurements, and medical backgrounds for pet owners.

### Technical Deliverables
- **Main Entity:** `Pet` (`ownerId`, `name`, `species`, `breed`, `gender`, `dateOfBirth`, `weight`, `description`, `image`)
- **Backend Files:**
  - `backend/src/functions/function1-pets/pet.model.ts`
  - `backend/src/functions/function1-pets/pet.service.ts`
  - `backend/src/functions/function1-pets/pet.controller.ts`
  - `backend/src/functions/function1-pets/pet.routes.ts`
  - `backend/src/functions/function1-pets/pet.validation.ts`
- **Frontend Files:**
  - `frontend/src/functions/function1-pets/services/petService.ts`
  - `frontend/src/functions/function1-pets/screens/PetListScreen.tsx`
  - `frontend/src/functions/function1-pets/screens/PetDetailScreen.tsx`
  - `frontend/src/functions/function1-pets/screens/AddPetScreen.tsx`
  - `frontend/src/functions/function1-pets/screens/EditPetScreen.tsx`
- **APIs:**
  - `POST /api/pets` — Create pet profile (with photo upload)
  - `GET /api/pets` — List pets belonging to the logged-in owner
  - `GET /api/pets/:id` — Retrieve pet details
  - `PUT /api/pets/:id` — Update pet attributes or photo
  - `DELETE /api/pets/:id` — Delete pet profile
- **Viva Topics:** Foreign key referencing in Mongoose (`ownerId`), optional multipart/form-data image handling with Multer disk storage, zero-binary MongoDB path referencing, and ownership verification middleware.

---

## Function 2 — Veterinarian Management

### Objective
Allow pet owners to find licensed veterinarians, review qualifications, explore clinic availability, and filter by medical specializations.

### Technical Deliverables
- **Main Entity:** `Veterinarian` (`name`, `specialization`, `qualification`, `experience`, `clinicName`, `phone`, `location`, `consultationFee`, `availability`, `profileImage`)
- **Backend Files:**
  - `backend/src/functions/function2-veterinarians/veterinarian.model.ts`
  - `backend/src/functions/function2-veterinarians/veterinarian.service.ts`
  - `backend/src/functions/function2-veterinarians/veterinarian.controller.ts`
  - `backend/src/functions/function2-veterinarians/veterinarian.routes.ts`
  - `backend/src/functions/function2-veterinarians/veterinarian.validation.ts`
- **Frontend Files:**
  - `frontend/src/functions/function2-veterinarians/services/vetService.ts`
  - `frontend/src/functions/function2-veterinarians/screens/VetListScreen.tsx`
  - `frontend/src/functions/function2-veterinarians/screens/VetDetailScreen.tsx`
- **APIs:**
  - `GET /api/veterinarians` — Query veterinarians by name, location, or specialization
  - `GET /api/veterinarians/:id` — Get full veterinarian profile and schedules
  - `POST /api/veterinarians` — Register new vet profile (veterinarian/admin role)
  - `PUT /api/veterinarians/:id` — Update schedule or clinic info
- **Viva Topics:** Subdocument schemas in Mongoose for recurring availability slots, indexing for text search and queries, and public vs protected route segregation.

---

## Function 3 — Appointment Management

### Objective
Coordinate clinical consultations between pet owners and veterinarians with lifecycle tracking (`pending` ➔ `confirmed` ➔ `completed` ➔ `cancelled`).

### Technical Deliverables
- **Main Entity:** `Appointment` (`petId`, `ownerId`, `veterinarianId`, `date`, `time`, `reason`, `status`, `notes`)
- **Backend Files:**
  - `backend/src/functions/function3-appointments/appointment.model.ts`
  - `backend/src/functions/function3-appointments/appointment.service.ts`
  - `backend/src/functions/function3-appointments/appointment.controller.ts`
  - `backend/src/functions/function3-appointments/appointment.routes.ts`
  - `backend/src/functions/function3-appointments/appointment.validation.ts`
- **Frontend Files:**
  - `frontend/src/functions/function3-appointments/services/appointmentService.ts`
  - `frontend/src/functions/function3-appointments/screens/AppointmentListScreen.tsx`
  - `frontend/src/functions/function3-appointments/screens/BookAppointmentScreen.tsx`
  - `frontend/src/functions/function3-appointments/screens/AppointmentDetailScreen.tsx`
- **APIs:**
  - `POST /api/appointments` — Schedule a vet consultation
  - `GET /api/appointments` — Get appointments filtered by status or user
  - `GET /api/appointments/:id` — Detailed view with populated pet & doctor info
  - `PUT /api/appointments/:id` — Update status or appointment notes
  - `DELETE /api/appointments/:id` — Cancel an appointment
- **Viva Topics:** Multi-table population (`populate(['petId', 'veterinarianId', 'ownerId'])`), state transition validation, and date/time conflict prevention.

---

## Function 4 — Medical Record Management

### Objective
Maintain an immutable health timeline for pets including clinical diagnosis, treatments, prescribed medications, and vaccination batches.

### Technical Deliverables
- **Main Entity:** `MedicalRecord` (`petId`, `veterinarianId`, `appointmentId`, `diagnosis`, `treatment`, `medications[]`, `vaccination`, `notes`, `recordDate`)
- **Backend Files:**
  - `backend/src/functions/function4-medical-records/medicalRecord.model.ts`
  - `backend/src/functions/function4-medical-records/medicalRecord.service.ts`
  - `backend/src/functions/function4-medical-records/medicalRecord.controller.ts`
  - `backend/src/functions/function4-medical-records/medicalRecord.routes.ts`
  - `backend/src/functions/function4-medical-records/medicalRecord.validation.ts`
- **Frontend Files:**
  - `frontend/src/functions/function4-medical-records/services/medicalRecordService.ts`
  - `frontend/src/functions/function4-medical-records/screens/MedicalRecordListScreen.tsx`
  - `frontend/src/functions/function4-medical-records/screens/MedicalRecordDetailScreen.tsx`
  - `frontend/src/functions/function4-medical-records/screens/AddMedicalRecordScreen.tsx`
- **APIs:**
  - `POST /api/medical-records` — Record diagnosis, medications, and vaccine (doctor role)
  - `GET /api/medical-records` — View timeline for a specific pet
  - `GET /api/medical-records/:id` — Get full checkup breakdown
  - `DELETE /api/medical-records/:id` — Remove erroneous clinical entry
- **Viva Topics:** Complex nested subdocument arrays in TypeScript, clinical history integrity, date handling for vaccination schedules, and doctor-only record creation permissions.

---

## Function 5 — Pet Service Management

### Objective
Maintain an interactive catalog of pet care services (grooming, bathing, nail trimming, boarding, training, walking).

### Technical Deliverables
- **Main Entity:** `Service` (`name`, `description`, `category`, `price`, `duration`, `provider`, `availability`, `image`)
- **Backend Files:**
  - `backend/src/functions/function5-services/service.model.ts`
  - `backend/src/functions/function5-services/service.service.ts`
  - `backend/src/functions/function5-services/service.controller.ts`
  - `backend/src/functions/function5-services/service.routes.ts`
  - `backend/src/functions/function5-services/service.validation.ts`
- **Frontend Files:**
  - `frontend/src/functions/function5-services/services/serviceService.ts`
  - `frontend/src/functions/function5-services/screens/ServiceListScreen.tsx`
  - `frontend/src/functions/function5-services/screens/ServiceDetailScreen.tsx`
- **APIs:**
  - `GET /api/services` — Public catalog with category filter & text search
  - `GET /api/services/:id` — Service details & pricing
  - `POST /api/services` — Admin service creation with picture
  - `PUT /api/services/:id` — Update pricing or availability
  - `DELETE /api/services/:id` — Archive/delete service
- **Viva Topics:** Category enumeration typing in TypeScript, filtering and pagination optimization, and administrative authorization safeguards.

---

## Function 6 — Service Bookings & Reviews

### Objective
Allow owners to book service sessions and leave verified star ratings (1 to 5) and feedback for clinics and services.

### Technical Deliverables
- **Main Entities:** `ServiceBooking`, `Review`
- **Backend Files:**
  - `backend/src/functions/function6-bookings-reviews/serviceBooking.model.ts`
  - `backend/src/functions/function6-bookings-reviews/serviceBooking.service.ts`
  - `backend/src/functions/function6-bookings-reviews/serviceBooking.controller.ts`
  - `backend/src/functions/function6-bookings-reviews/serviceBooking.routes.ts`
  - `backend/src/functions/function6-bookings-reviews/review.model.ts`
  - `backend/src/functions/function6-bookings-reviews/review.service.ts`
  - `backend/src/functions/function6-bookings-reviews/review.controller.ts`
  - `backend/src/functions/function6-bookings-reviews/review.routes.ts`
  - `backend/src/functions/function6-bookings-reviews/validation/bookingValidation.ts`
  - `backend/src/functions/function6-bookings-reviews/validation/reviewValidation.ts`
- **Frontend Files:**
  - `frontend/src/functions/function6-bookings-reviews/services/bookingService.ts`
  - `frontend/src/functions/function6-bookings-reviews/services/reviewService.ts`
  - `frontend/src/functions/function6-bookings-reviews/screens/BookServiceScreen.tsx`
  - `frontend/src/functions/function6-bookings-reviews/screens/MyBookingsScreen.tsx`
  - `frontend/src/functions/function6-bookings-reviews/screens/AddReviewScreen.tsx`
- **APIs:**
  - `POST /api/service-bookings` — Reserve a service slot
  - `GET /api/service-bookings` — View user reservations
  - `PATCH /api/service-bookings/:id` — Update booking status or cancel
  - `POST /api/reviews` — Submit 1-5 star review for vet or service
  - `GET /api/reviews` — Retrieve reviews for a vet or service
- **Viva Topics:** Polymorphic referencing in reviews (service vs veterinarian target), compound indexes in MongoDB for fast retrieval, and cancellation window constraints.

---

## 🤝 Shared Responsibilities
All functions cooperate on:
1. End-to-end user navigation flow from login to home dashboard to detail screens.
2. Error response uniformity using the standardized `{ success, message, data }` envelope.
3. Strict TypeScript typing across frontend services and backend schemas.
4. Git branch hygiene (`develop` integration with feature branches).
