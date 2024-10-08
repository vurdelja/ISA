use isabaza;

select * from Users;


INSERT INTO Users (Email, Password, UserRole, Name, Surname, CompanyId, IsPredef, PenaltyScore)
VALUES ('admin@example.com', 'adminadmin', 2, 'Admin', 'Adminovic', 0, 0, 0);

INSERT INTO Users (Email, Password, UserRole, Name, Surname, CompanyId, IsPredef, PenaltyScore)
VALUES ('korisnik@example.com', 'korisnik', 0, 'Korisnik', 'Korisnikovic', 1, 0, 0);

INSERT INTO Users (Email, Password, UserRole, Name, Surname, CompanyId, IsPredef, PenaltyScore)
VALUES ('sef@example.com', 'sef', 1, 'Sef', 'Sefovic', 0, 0, 0);

select * from Persons;

SELECT UserID, Email FROM Persons WHERE Email = 'korisnik@example.com';

INSERT INTO Persons (Email, Password, Name, Surname, City, Country, Phone, Profession, CompanyInfo, MemberSince, ActivationLink, IsActivated)
VALUES ('admin@example.com', 'adminadmin', 'Admin', 'Adminovic', 'Admin City', 'Admin Country', '1234567890', 'Administrator', 'Admin Company', GETDATE(), 'http://activationlink.com/admin', 1);

INSERT INTO Persons (Email, Password, Name, Surname, City, Country, Phone, Profession, CompanyInfo, MemberSince, ActivationLink, IsActivated)
VALUES ('korisnik@example.com', 'korisnik', 'Korisnik', 'Korisnikovic', 'User City', 'User Country', '0987654321', 'User', 'User Company', GETDATE(), 'http://activationlink.com/korisnik', 1);

INSERT INTO Persons (Email, Password, Name, Surname, City, Country, Phone, Profession, CompanyInfo, MemberSince, ActivationLink, IsActivated)
VALUES ('sef@example.com', 'sef', 'Sef', 'Sefovic', 'Manager City', 'Manager Country', '1122334455', 'Manager', 'Manager Company', GETDATE(), 'http://activationlink.com/sef', 1);


select * from Users;

INSERT INTO Companies (Name, Address, Description, AverageRating, EquipmentId, OpeningTime, ClosingTime)
VALUES ('Company A', '123 Main St', 'A great company', 4.5, 1, '08:00', '17:00');

INSERT INTO Companies (Name, Address, Description, AverageRating, EquipmentId, OpeningTime, ClosingTime)
VALUES ('Company B', '456 Elm St', 'An excellent company', 4.7, 2, '09:00', '18:00');

INSERT INTO Companies (Name, Address, Description, AverageRating, EquipmentId, OpeningTime, ClosingTime)
VALUES ('Company C', '789 Oak St', 'A wonderful company', 4.8, 3, '10:00', '19:00');

select * from Companies;


select * from CompanyRates;

INSERT INTO Appointments (AdministratorsId, CompanyId, ReservationId, AdministratorsName, AdministratorsSurname, Start, EndTime, Duration, Status)
VALUES (1, 1, 1, 'John', 'Doe', '2024-06-15 09:00:00', '2024-06-15 10:00:00', 60, 0);

INSERT INTO Appointments (AdministratorsId, CompanyId, ReservationId, AdministratorsName, AdministratorsSurname, Start, EndTime, Duration, Status)
VALUES (2, 2, 2, 'Jane', 'Smith', '2024-06-16 10:00:00', '2024-06-16 11:00:00', 60, 0);

INSERT INTO Appointments (AdministratorsId, CompanyId, ReservationId, AdministratorsName, AdministratorsSurname, Start, EndTime, Duration, Status)
VALUES (3, 3, 3, 'James', 'Brown', '2024-06-17 11:00:00', '2024-06-17 12:00:00', 60, 0);

select * from Appointments;

INSERT INTO CompanyRates (Rate, HighQuality, LowQuality, Cheap, Expensive, WideSelection, LimitedSelection, Description, CompanyId, UserId)
VALUES (4.5, 1, 0, 1, 0, 1, 0, 'Excellent quality and affordable', 1, 1);

INSERT INTO CompanyRates (Rate, HighQuality, LowQuality, Cheap, Expensive, WideSelection, LimitedSelection, Description, CompanyId, UserId)
VALUES (4.7, 1, 0, 0, 1, 1, 0, 'High quality but expensive', 2, 2);

INSERT INTO CompanyRates (Rate, HighQuality, LowQuality, Cheap, Expensive, WideSelection, LimitedSelection, Description, CompanyId, UserId)
VALUES (4.8, 1, 0, 1, 0, 1, 0, 'Great selection and quality', 3, 3);



-- Inserting reservations for the user "Korisnik"
INSERT INTO Reservations (UserId, EquipmentId, EquipmentCount, IsCollected, Name, Surname, Deadline, CompanyId)
VALUES (2, 1, 5, 0, 'Korisnik', 'Korisnikovic', '2024-06-20', 1);

INSERT INTO Reservations (UserId, EquipmentId, EquipmentCount, IsCollected, Name, Surname, Deadline, CompanyId)
VALUES (2, 2, 3, 0, 'Korisnik', 'Korisnikovic', '2024-06-21', 2);

INSERT INTO Reservations (UserId, EquipmentId, EquipmentCount, IsCollected, Name, Surname, Deadline, CompanyId)
VALUES (2, 3, 2, 0, 'Korisnik', 'Korisnikovic', '2024-06-22', 3);


select * from CompanyRates;
select * from Persons;

UPDATE Reservations
SET companyid = 2 where id=3;

UPDATE CompanyRates
SET UserId = 6 where CompanyId = 2;

  Email = 'nina.v@example.com',
  Password = 'korisnik',
  Name = 'Korisnik',
  Surname = 'Korisnikovic',
  City = 'Novi Sad',
  Country = 'Srbija',
  Phone = '0679543298',
  Profession = 'Korisnik',
  CompanyInfo = 'Company X',
  MemberSince = GETDATE()
WHERE UserID = 2;

UPDATE Persons
SET
  Email = 'nina.v@example.com',
  Password = 'korisnik',
  Name = 'Korisnik',
  Surname = 'Korisnikovic',
  City = 'Novi Sad',
  Country = 'Srbija',
  Phone = '0679543298',
  Profession = 'Korisnik',
  CompanyInfo = 'Company X',
  MemberSince = GETDATE()
WHERE UserID = 2;

INSERT INTO Equipment (Name, Type, Description, Rating)
VALUES ('Equipment1', 'Type1', 'Description1', 4.0);

select * from Equipment;

DROP TABLE Appointments;
DROP TABLE CompanyRates;
DROP TABLE Equipment;
DROP TABLE Persons;
DROP TABLE Reservations;
DROP TABLE Users;
DROP TABLE __EFMigrationsHistory;
DROP TABLE Companies;