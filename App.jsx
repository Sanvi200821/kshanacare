import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { QRCodeSVG } from "qrcode.react";

import {
  Home,
  Search,
  CalendarDays,
  Ticket,
  Navigation,
  History,
  HelpCircle,
  LogOut,
  Stethoscope,
  Clock,
  MapPin,
  CheckCircle2,
  CreditCard,
  QrCode,
  ArrowRight,
  Bell,
  User,
  FileText,
} from "lucide-react";

import "./App.css";

/* =========================================================
   3D DNA BACKGROUND
========================================================= */

function DNAHelix() {
  const group = useRef();

  const dna = useMemo(() => {
    const left = [];
    const right = [];
    const rungs = [];

    const count = 40;
    const radius = 1.55;
    const height = 8;
    const turns = 2.5;

    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);

      const y = -height / 2 + t * height;
      const angle = t * Math.PI * 2 * turns;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      left.push(new THREE.Vector3(x, y, z));
      right.push(new THREE.Vector3(-x, y, -z));

      if (i % 2 === 0) {
        rungs.push({
          start: new THREE.Vector3(x, y, z),
          end: new THREE.Vector3(-x, y, -z),
        });
      }
    }

    return {
      left,
      right,
      rungs,
    };
  }, []);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.18;
      group.current.rotation.z =
        Math.sin(performance.now() * 0.00025) * 0.04;
    }
  });

  return (
    <group
      ref={group}
      position={[3.1, 0, -0.5]}
      rotation={[0.1, 0, 0]}
    >
      {/* Left DNA strand */}
      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={(geometry) =>
            geometry.setFromPoints(dna.left)
          }
        />
        <lineBasicMaterial
          attach="material"
          color="#38e8ff"
          linewidth={3}
        />
      </line>

      {/* Right DNA strand */}
      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={(geometry) =>
            geometry.setFromPoints(dna.right)
          }
        />
        <lineBasicMaterial
          attach="material"
          color="#8b7cff"
          linewidth={3}
        />
      </line>

      {/* DNA connection bars */}
      {dna.rungs.map((rung, index) => {
        const points = [rung.start, rung.end];

        return (
          <line key={index}>
            <bufferGeometry
              attach="geometry"
              onUpdate={(geometry) =>
                geometry.setFromPoints(points)
              }
            />
            <lineBasicMaterial
              attach="material"
              color={index % 2 === 0 ? "#62f5ff" : "#a996ff"}
              transparent
              opacity={0.75}
            />
          </line>
        );
      })}

      {/* Glowing DNA nodes */}
      {dna.left.map((point, index) => (
        <mesh key={`left-${index}`} position={point}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial
            color="#39eaff"
            emissive="#39eaff"
            emissiveIntensity={3}
          />
        </mesh>
      ))}

      {dna.right.map((point, index) => (
        <mesh key={`right-${index}`} position={point}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial
            color="#907dff"
            emissive="#907dff"
            emissiveIntensity={3}
          />
        </mesh>
      ))}
    </group>
  );
}

function DNA3DBackground() {
  return (
    <div className="dna-3d-background">
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 45,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <color attach="background" args={["#020914"]} />

        <fog
          attach="fog"
          args={["#020914", 7, 18]}
        />

        <ambientLight intensity={0.8} />

        <pointLight
          position={[4, 4, 6]}
          intensity={18}
          color="#36eaff"
        />

        <pointLight
          position={[-4, -3, 4]}
          intensity={12}
          color="#786cff"
        />

        <DNAHelix />

        <Sparkles
          count={180}
          scale={[13, 9, 9]}
          size={1.5}
          speed={0.2}
          color="#a8f8ff"
        />
      </Canvas>
    </div>
  );
}

/* =========================================================
   LANDING PAGE
========================================================= */

function LandingPage({ onStart }) {
  return (
    <div className="landing-page">
      <DNA3DBackground />

      <div className="landing-overlay">
        <div className="landing-content">
          <div className="landing-badge">
            SMART PATIENT CARE
          </div>

          <h1>
            Kshana<span>care</span>
          </h1>

          <p className="landing-title">
            Your healthcare journey,
            <br />
            simplified.
          </p>

          <p className="landing-description">
            Book appointments, check in with QR,
            <br />
            track your queue and manage billing
            <br />
            from one place.
          </p>

          <button
            type="button"
            className="get-started-btn"
            onClick={onStart}
          >
            GET STARTED
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   LOGIN
========================================================= */

function LoginPage({ onLogin }) {
  const [role, setRole] = useState("patient");
  const [method, setMethod] = useState("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const sendOTP = () => {
    if (method === "phone" && phone.length < 10) {
      alert("Please enter a valid mobile number.");
      return;
    }

    if (method === "email" && !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    setOtpSent(true);

    // Demo OTP
    alert("Demo OTP: 123456");
  };

  const verifyOTP = () => {
    if (otp === "123456") {
      onLogin(role);
    } else {
      alert("Incorrect OTP. For this demo, use 123456.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          Kshanacare
        </div>

        <h1>
          {otpSent ? "Verify OTP" : "Welcome to Kshanacare"}
        </h1>

        <p className="login-subtitle">
          {otpSent
            ? `Enter the OTP sent to your ${
                method === "phone" ? "mobile number" : "email"
              }`
            : "Secure access to your healthcare journey"}
        </p>

        {!otpSent ? (
          <>
            <h3 className="login-section-title">
              Login as
            </h3>

            <div className="role-buttons">

              <button
                type="button"
                className={role === "patient" ? "role-btn active" : "role-btn"}
                onClick={() => setRole("patient")}
              >
                <span>👤</span>
                <div>
                  <strong>Patient</strong>
                  <small>Book and manage appointments</small>
                </div>
              </button>

              <button
                type="button"
                className={role === "doctor" ? "role-btn active" : "role-btn"}
                onClick={() => setRole("doctor")}
              >
                <span>👨‍⚕️</span>
                <div>
                  <strong>Doctor</strong>
                  <small>Manage patients and appointments</small>
                </div>
              </button>

              <button
                type="button"
                className={role === "admin" ? "role-btn active" : "role-btn"}
                onClick={() => setRole("admin")}
              >
                <span>🏥</span>
                <div>
                  <strong>Hospital Admin</strong>
                  <small>Manage hospital operations</small>
                </div>
              </button>

            </div>

            <div className="login-methods">
              <button
                type="button"
                className={method === "phone" ? "method-btn active" : "method-btn"}
                onClick={() => setMethod("phone")}
              >
                Mobile OTP
              </button>

              <button
                type="button"
                className={method === "email" ? "method-btn active" : "method-btn"}
                onClick={() => setMethod("email")}
              >
                Email OTP
              </button>
            </div>

            {method === "phone" ? (
              <div className="input-group">
                <label>Mobile Number</label>

                <div className="phone-input">
                  <span>+91</span>

                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phone}
                    maxLength="10"
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="input-group">
                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            <button
              type="button"
              className="login-main-btn"
              onClick={sendOTP}
            >
              SEND OTP
            </button>
          </>
        ) : (
          <>
            <div className="otp-icon">
              🔐
            </div>

            <div className="input-group">
              <label>Enter 6-digit OTP</label>

              <input
                className="otp-input"
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="123456"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>

            <button
              type="button"
              className="login-main-btn"
              onClick={verifyOTP}
            >
              VERIFY & CONTINUE
            </button>

            <button
              type="button"
              className="back-login-btn"
              onClick={() => {
                setOtpSent(false);
                setOtp("");
              }}
            >
              ← Change login method
            </button>

            <p className="demo-note">
              Demo OTP: <strong>123456</strong>
            </p>
          </>
        )}

        <div className="login-security">
          🔒 Your login is protected
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    id: "find",
    label: "Find Care",
    icon: Search,
  },
  {
    id: "book",
    label: "Book",
    icon: CalendarDays,
  },
  {
    id: "queue",
    label: "My Queue",
    icon: Ticket,
  },
  {
    id: "navigate",
    label: "Navigate",
    icon: Navigation,
  },
  {
    id: "history",
    label: "History",
    icon: History,
  },
  {
    id: "help",
    label: "Help",
    icon: HelpCircle,
  },
];

function Sidebar({
  activePage,
  setActivePage,
  onLogout,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">K</div>

        <div>
          <h2>
            Kshana<span>care</span>
          </h2>
          <small>Smart Patient Care</small>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={
                activePage === item.id
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              onClick={() => setActivePage(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        className="logout-button"
        onClick={onLogout}
      >
        <LogOut size={19} />
        Logout
      </button>
    </aside>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  appointment,
  onNavigate,
}) {
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            PATIENT DASHBOARD
          </span>

          <h1>Good morning, Sanvi 👋</h1>

          <p>
            Here is your healthcare journey at a glance.
          </p>
        </div>

        <div className="profile-circle">
          S
        </div>
      </div>

      {appointment ? (
        <div className="appointment-highlight">
          <div>
            <span className="card-label">
              UPCOMING APPOINTMENT
            </span>

            <h2>
              Dr. Ananya Rao
            </h2>

            <p>
              Cardiology • Today • 3:30 PM
            </p>

            <div className="appointment-token">
              Token {appointment.token}
            </div>
          </div>

          <div className="dashboard-status">
            <CheckCircle2 size={24} />
            <span>Booked</span>
          </div>
        </div>
      ) : (
        <div className="empty-appointment">
          <CalendarDays size={40} />

          <h2>No upcoming appointment</h2>

          <p>
            Find a doctor and book your next visit.
          </p>

          <button
            onClick={() => onNavigate("find")}
            className="primary-button"
          >
            Find Care
          </button>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="info-card">
          <div className="icon-box blue">
            <Ticket size={22} />
          </div>

          <span>LIVE QUEUE</span>

          <h3>
            {appointment
              ? appointment.token
              : "--"}
          </h3>

          <p>
            {appointment
              ? "Your appointment token"
              : "No active queue"}
          </p>
        </div>

        <div className="info-card">
          <div className="icon-box purple">
            <QrCode size={22} />
          </div>

          <span>QR CHECK-IN</span>

          <h3>
            {appointment
              ? appointment.checkedIn
                ? "Checked in"
                : "Ready"
              : "--"}
          </h3>

          <p>
            {appointment
              ? "Use your appointment QR"
              : "Book first"}
          </p>
        </div>

        <div className="info-card">
          <div className="icon-box green">
            <CreditCard size={22} />
          </div>

          <span>BILLING</span>

          <h3>
            {appointment?.bill
              ? `₹${appointment.bill.total}`
              : "Pending"}
          </h3>

          <p>
            {appointment?.bill
              ? "Bill available"
              : "After consultation"}
          </p>
        </div>
      </div>

      <div className="journey-card">
        <h2>Your Kshanacare Journey</h2>

        <div className="journey">
          {[
            "Book",
            "QR Check-in",
            "Live Queue",
            "Consultation",
            "Billing",
          ].map((step, index) => (
            <div
              className="journey-step"
              key={step}
            >
              <div className="journey-number">
                {index + 1}
              </div>

              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FIND CARE
========================================================= */

function FindCare({ onBook }) {
  const doctors = [
    {
      name: "Dr. Ananya Rao",
      department: "Cardiology",
      experience: "12 years",
      time: "3:30 PM",
    },
    {
      name: "Dr. Rahul Mehta",
      department: "Neurology",
      experience: "10 years",
      time: "4:00 PM",
    },
    {
      name: "Dr. Priya Sharma",
      department: "General Medicine",
      experience: "8 years",
      time: "4:30 PM",
    },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            FIND CARE
          </span>

          <h1>Find the right doctor</h1>

          <p>
            Search doctors and departments.
          </p>
        </div>
      </div>

      <div className="search-box">
        <Search size={21} />
        <input
          placeholder="Search doctor or department..."
        />
      </div>

      <div className="doctor-grid">
        {doctors.map((doctor) => (
          <div
            className="doctor-card"
            key={doctor.name}
          >
            <div className="doctor-avatar">
              {doctor.name.charAt(4)}
            </div>

            <div className="doctor-info">
              <h3>{doctor.name}</h3>

              <p>{doctor.department}</p>

              <span>
                {doctor.experience} experience
              </span>

              <div className="doctor-time">
                <Clock size={16} />
                Today • {doctor.time}
              </div>
            </div>

            <button
              className="outline-button"
              onClick={onBook}
            >
              Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   BOOK
========================================================= */

function BookAppointment({
  appointment,
  onBook,
}) {
  const [doctor, setDoctor] =
    useState("Dr. Ananya Rao");

  const [time, setTime] =
    useState("3:30 PM");

  const [message, setMessage] =
    useState("");

  function submitBooking() {
    const result = onBook({
      doctor,
      time,
    });

    setMessage(result.message);
  }

  if (appointment) {
    return (
      <div className="page-content">
        <div className="page-header">
          <div>
            <span className="eyebrow">
              APPOINTMENT CONFIRMED
            </span>

            <h1>Your appointment is ready</h1>

            <p>
              Keep this QR code ready when you
              reach the hospital.
            </p>
          </div>
        </div>

        <div className="confirmation-layout">
          <div className="confirmation-card">
            <div className="success-icon">
              <CheckCircle2 size={30} />
            </div>

            <h2>
              Dr. {appointment.doctor.replace(
                "Dr. ",
                ""
              )}
            </h2>

            <p>Cardiology</p>

            <div className="confirmation-details">
              <div>
                <span>Date</span>
                <strong>Today</strong>
              </div>

              <div>
                <span>Time</span>
                <strong>{appointment.time}</strong>
              </div>

              <div>
                <span>Token</span>
                <strong>{appointment.token}</strong>
              </div>
            </div>
          </div>

          <div className="qr-card">
            <div className="qr-title">
              <QrCode size={22} />
              Hospital Check-in QR
            </div>

            <QRCodeSVG
              value={`kshanacare:appointment:${appointment.id}`}
              size={190}
              level="H"
            />

            <p>
              Scan this QR at the hospital
              check-in counter.
            </p>

            <small>
              Appointment ID: {appointment.id}
            </small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            BOOK APPOINTMENT
          </span>

          <h1>Schedule your visit</h1>

          <p>
            Select your doctor and preferred time.
          </p>
        </div>
      </div>

      <div className="booking-card">
        <label>
          Doctor
          <select
            value={doctor}
            onChange={(e) =>
              setDoctor(e.target.value)
            }
          >
            <option>
              Dr. Ananya Rao
            </option>

            <option>
              Dr. Rahul Mehta
            </option>

            <option>
              Dr. Priya Sharma
            </option>
          </select>
        </label>

        <label>
          Date
          <input
            type="date"
            defaultValue="2026-10-03"
          />
        </label>

        <label>
          Time Slot
          <select
            value={time}
            onChange={(e) =>
              setTime(e.target.value)
            }
          >
            <option>3:30 PM</option>
            <option>4:00 PM</option>
            <option>4:30 PM</option>
          </select>
        </label>

        <button
          className="primary-button"
          onClick={submitBooking}
        >
          Confirm Appointment
          <ArrowRight size={18} />
        </button>

        {message && (
          <div className="booking-message">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MY QUEUE + QR CHECK-IN + BILLING
========================================================= */

function MyQueue({
  appointment,
  onCheckIn,
  onPay,
}) {
  if (!appointment) {
    return (
      <div className="page-content">
        <div className="empty-appointment">
          <Ticket size={42} />

          <h2>No active appointment</h2>

          <p>
            Book an appointment to see your live queue.
          </p>
        </div>
      </div>
    );
  }

  const bill = appointment.bill;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            MY QUEUE
          </span>

          <h1>
            {appointment.checkedIn
              ? "You are in the queue"
              : "Check in for your visit"}
          </h1>

          <p>
            {appointment.checkedIn
              ? "We will keep your queue status updated."
              : "Scan your appointment QR at the hospital."}
          </p>
        </div>

        <div className="live-badge">
          <span></span>
          LIVE
        </div>
      </div>

      {!appointment.checkedIn && (
        <div className="checkin-card">
          <div className="checkin-left">
            <div className="icon-box purple large">
              <QrCode size={30} />
            </div>

            <div>
              <span className="card-label">
                QR CHECK-IN
              </span>

              <h2>
                Ready for hospital check-in
              </h2>

              <p>
                Show your appointment QR at the
                hospital entrance or scan station.
              </p>
            </div>
          </div>

          <button
            className="primary-button"
            onClick={onCheckIn}
          >
            <QrCode size={18} />
            Simulate QR Check-in
          </button>
        </div>
      )}

      {appointment.checkedIn && (
        <>
          <div className="queue-main-card">
            <div className="token-circle">
              {appointment.token}
            </div>

            <div className="queue-details">
              <span>YOUR TOKEN</span>

              <h2>{appointment.token}</h2>

              <p>
                Dr. {appointment.doctor.replace(
                  "Dr. ",
                  ""
                )} • Cardiology
              </p>
            </div>

            <div className="queue-number">
              <span>Patients ahead</span>
              <strong>
                {appointment.patientsAhead}
              </strong>
            </div>

            <div className="queue-number">
              <span>Estimated wait</span>
              <strong>
                {appointment.waitTime} min
              </strong>
            </div>
          </div>

          <div className="current-token">
            <div>
              <span>CURRENTLY SERVING</span>

              <strong>
                {appointment.currentToken}
              </strong>
            </div>

            <Bell size={25} />
          </div>

          <div className="next-card">
            <CheckCircle2 size={28} />

            <div>
              <strong>
                You are checked in
              </strong>

              <p>
                Stay nearby. We will notify you
                when your token is approaching.
              </p>
            </div>
          </div>
        </>
      )}

      {bill && (
        <div className="billing-card">
          <div className="billing-header">
            <div>
              <span className="eyebrow">
                BILLING
              </span>

              <h2>
                Consultation bill
              </h2>
            </div>

            <CreditCard size={28} />
          </div>

          <div className="bill-row">
            <span>Doctor consultation</span>
            <strong>
              ₹{bill.consultation}
            </strong>
          </div>

          <div className="bill-row">
            <span>Hospital services</span>
            <strong>
              ₹{bill.services}
            </strong>
          </div>

          <div className="bill-row total">
            <span>Total</span>
            <strong>
              ₹{bill.total}
            </strong>
          </div>

          {bill.paid ? (
            <div className="paid-message">
              <CheckCircle2 size={20} />
              Payment completed
            </div>
          ) : (
            <button
              className="primary-button"
              onClick={onPay}
            >
              Pay ₹{bill.total}
              <CreditCard size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   NAVIGATE
========================================================= */

function NavigatePage() {
  const [started, setStarted] = useState(false);

  return (
    <div className="navigation-page">

      {/* YOU'RE NEXT */}
      <div className="next-token-card">
        <span className="next-label">YOU'RE NEXT!</span>

        <h1>Token A-122</h1>

        <p>
          Dr. Ananya Sharma • Cardiology
        </p>
      </div>

      {/* DESTINATION */}
      <div className="destination-card">
        <div className="destination-icon">
          <MapPin size={22} />
        </div>

        <div>
          <span className="navigation-label">
            DESTINATION
          </span>

          <h2>Room 204</h2>

          <p>Block B • 2nd Floor</p>
        </div>
      </div>

      {/* INDOOR MAP */}
      <div className="hospital-map">

        <div className="room-number room-201">
          201
        </div>

        <div className="room-number room-202">
          202
        </div>

        <div className="room-number target-room">
          204
        </div>

        {/* Walking route */}
        <div className="route-line route-one"></div>
        <div className="route-line route-two"></div>

        {/* YOU marker */}
        <div className="you-marker">
          YOU
        </div>

        {/* Destination marker */}
        <div className="destination-marker">
          204
        </div>
      </div>

      {/* NAVIGATION DETAILS */}
      <div className="navigation-stats">

        <div className="navigation-stat">
          <strong>4 min</strong>
          <span>Walking</span>
        </div>

        <div className="navigation-stat">
          <strong>210 m</strong>
          <span>Distance</span>
        </div>

        <div className="navigation-stat">
          <strong>2nd</strong>
          <span>Floor</span>
        </div>

      </div>

      {/* START NAVIGATION */}
      <button
        className="start-navigation-button"
        onClick={() => setStarted(true)}
      >
        {started ? (
          <>
            <Navigation size={19} />
            Navigation started
          </>
        ) : (
          <>
            Start navigation
            <ArrowRight size={19} />
          </>
        )}
      </button>

    </div>
  );
}

/* =========================================================
   HISTORY
========================================================= */

function HistoryPage({
  appointment,
}) {
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            HISTORY
          </span>

          <h1>Your visits</h1>

          <p>
            Appointments, check-ins and billing.
          </p>
        </div>
      </div>

      {appointment ? (
        <div className="history-card">
          <div className="history-icon">
            <Stethoscope size={22} />
          </div>

          <div className="history-info">
            <h3>
              {appointment.doctor}
            </h3>

            <p>
              Cardiology • Today •{" "}
              {appointment.time}
            </p>

            <span>
              Token {appointment.token}
            </span>
          </div>

          <div className="history-status">
            {appointment.bill?.paid
              ? "Paid"
              : appointment.checkedIn
              ? "Checked in"
              : "Booked"}
          </div>
        </div>
      ) : (
        <div className="empty-appointment">
          <History size={40} />

          <h2>No visit history yet</h2>

          <p>
            Your appointments will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   HELP
========================================================= */

function HelpPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            HELP
          </span>

          <h1>How can we help?</h1>

          <p>
            Everything you need for your hospital visit.
          </p>
        </div>
      </div>

      <div className="help-grid">
        <div className="help-card">
          <QrCode size={28} />

          <h3>
            QR Check-in
          </h3>

          <p>
            Open your appointment and show the QR
            code at the hospital check-in point.
          </p>
        </div>

        <div className="help-card">
          <Ticket size={28} />

          <h3>
            Live Queue
          </h3>

          <p>
            After check-in, your token and estimated
            waiting time will appear in My Queue.
          </p>
        </div>

        <div className="help-card">
          <CreditCard size={28} />

          <h3>
            Billing
          </h3>

          <p>
            After consultation, your bill appears
            automatically in your visit.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PATIENT APP
========================================================= */

function PatientApp({
  onLogout,
}) {
  const [activePage, setActivePage] =
    useState("dashboard");

  const [appointment, setAppointment] =
    useState(null);

  function createAppointment(data) {
    if (
      appointment &&
      appointment.time === data.time
    ) {
      return {
        message:
          "You already have an appointment at this time. Please select another time.",
      };
    }

    const newAppointment = {
      id: `KC-${Date.now()}`,
      doctor: data.doctor,
      time: data.time,
      token: "A-127",
      currentToken: "A-121",
      patientsAhead: 6,
      waitTime: 25,
      checkedIn: false,
      bill: null,
    };

    setAppointment(newAppointment);

    setActivePage("book");

    return {
      message: "Appointment confirmed!",
    };
  }

  function checkIn() {
    setAppointment((previous) => ({
      ...previous,
      checkedIn: true,
    }));
  }

  function payBill() {
    setAppointment((previous) => ({
      ...previous,
      bill: {
        consultation: 1200,
        services: 450,
        total: 1650,
        paid: true,
      },
    }));
  }

  function renderPage() {
    switch (activePage) {
      case "dashboard":
        return (
          <Dashboard
            appointment={appointment}
            onNavigate={setActivePage}
          />
        );

      case "find":
        return (
          <FindCare
            onBook={() => setActivePage("book")}
          />
        );

      case "book":
        return (
          <BookAppointment
            appointment={appointment}
            onBook={createAppointment}
          />
        );

      case "queue":
        return (
          <MyQueue
            appointment={appointment}
            onCheckIn={checkIn}
            onPay={payBill}
          />
        );

      case "navigate":
        return <NavigatePage />;

      case "history":
        return (
          <HistoryPage
            appointment={appointment}
          />
        );

      case "help":
        return <HelpPage />;

      default:
        return null;
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={onLogout}
      />

      <main className="main-panel">
        {renderPage()}
      </main>
    </div>
  );
}

/* =========================================================
   DOCTOR DASHBOARD
========================================================= */

function DoctorDashboard({
  onLogout,
}) {
  return (
    <div className="role-dashboard">
      <div className="role-header">
        <div>
          <span className="eyebrow">
            DOCTOR PORTAL
          </span>

          <h1>
            Good morning, Dr. Ananya Rao
          </h1>

          <p>
            Manage today's appointments and queue.
          </p>
        </div>

        <button
          className="logout-top"
          onClick={onLogout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="doctor-stats">
        <div>
          <span>Today's Patients</span>
          <strong>18</strong>
        </div>

        <div>
          <span>Current Token</span>
          <strong>A-121</strong>
        </div>

        <div>
          <span>Waiting</span>
          <strong>6</strong>
        </div>
      </div>

      <div className="doctor-queue">
        <h2>Today's Queue</h2>

        {[
          ["A-121", "Patient 1", "Consulting"],
          ["A-122", "Patient 2", "Waiting"],
          ["A-123", "Patient 3", "Waiting"],
          ["A-124", "Patient 4", "Waiting"],
        ].map((item) => (
          <div
            className="doctor-patient"
            key={item[0]}
          >
            <strong>{item[0]}</strong>

            <span>{item[1]}</span>

            <em>{item[2]}</em>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function AdminDashboard({
  onLogout,
}) {
  return (
    <div className="role-dashboard">
      <div className="role-header">
        <div>
          <span className="eyebrow">
            HOSPITAL ADMIN
          </span>

          <h1>
            Hospital Operations
          </h1>

          <p>
            Monitor appointments, queues and billing.
          </p>
        </div>

        <button
          className="logout-top"
          onClick={onLogout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="admin-grid">
        <div>
          <span>Appointments Today</span>
          <strong>142</strong>
        </div>

        <div>
          <span>Active Queues</span>
          <strong>12</strong>
        </div>

        <div>
          <span>Checked In</span>
          <strong>96</strong>
        </div>

        <div>
          <span>Billing Completed</span>
          <strong>₹1.84L</strong>
        </div>
      </div>

      <div className="admin-panel">
        <h2>System Status</h2>

        <div className="status-row">
          <CheckCircle2 size={20} />
          Appointment system
          <strong>Online</strong>
        </div>

        <div className="status-row">
          <CheckCircle2 size={20} />
          QR Check-in
          <strong>Online</strong>
        </div>

        <div className="status-row">
          <CheckCircle2 size={20} />
          Billing system
          <strong>Online</strong>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  const [started, setStarted] =
    useState(false);

  const [user, setUser] =
    useState(null);

  function handleLogin(role) {
    setUser(role);
  }

  function handleLogout() {
    setUser(null);
    setStarted(false);
  }

  if (!started) {
    return (
      <LandingPage
        onStart={() => setStarted(true)}
      />
    );
  }

  if (!user) {
    return (
      <LoginPage
        onLogin={handleLogin}
      />
    );
  }

  if (user === "doctor") {
    return (
      <DoctorDashboard
        onLogout={handleLogout}
      />
    );
  }

  if (user === "admin") {
    return (
      <AdminDashboard
        onLogout={handleLogout}
      />
    );
  }

  return (
    <PatientApp
      onLogout={handleLogout}
    />
  );
}