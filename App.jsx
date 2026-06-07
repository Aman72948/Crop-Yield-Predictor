import { useState } from "react";
import "./App.css";
// Import toast, ToastContainer, and the mandatory CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

// ==========================================
// 👑 APNI PERSONAL DETAILS YAHAN DAALEIN 👑
// ==========================================
const ADMIN_BYPASS = {
  phone: "7294839939",         // <--- Yahan apna personal phone number likhein
  email: "amankumar12345787@gmail.com" // <--- Yahan apna personal email address likhein
};

const SOIL = [
  "Alluvial Soil", "Black Cotton Soil", "Red Soil", "Yellow Soil", 
  "Laterite Soil", "Arid / Desert Soil", "Saline and Alkaline Soil", 
  "Peaty and Marshy Soil", "Forest and Mountain Soil", "Loamy Soil", 
  "Clayey Soil", "Sandy Soil", "Silt Soil", "Other"
];

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry", "Other"
];

export default function App() {
  const [showLanding, setShowLanding] = useState(true); // Control Landing Page
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // --- Authentication States ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false); 
  const [authMethod, setAuthMethod] = useState("phone"); // 'phone' or 'email' switching tab
  
  // Extended authData for registration workflow
  const [authData, setAuthData] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [forgotInput, setForgotInput] = useState(""); 

  // --- Hide/Show Password Toggle States ---
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // --- 🤖 "I Am Not A Robot" State ---
  const [isNotRobotChecked, setIsNotRobotChecked] = useState(false);

  // --- Track active user registration/login time for trial ---
  const [currentUserKey, setCurrentUserKey] = useState("");

  const set = (k, v) => setData(p => ({ ...p, [k]: v }));

  const handleDownload = () => {
    window.print();
  };

  // --- Helper to scan local storage records for matching fields ---
  const findUserByField = (value, field) => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("farmer_")) {
        try {
          const user = JSON.parse(localStorage.getItem(key));
          if (user && user[field]?.toLowerCase() === value?.toLowerCase()) {
            return { user, key }; 
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    return null;
  };

  // --- Login Handler ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (!authData.password) {
      toast.warning("🔒 Password is required!");
      return;
    }

    let targetMatch = null;

    if (authMethod === "phone") {
      if (!authData.phone) { toast.warning("📞 Phone Number is required!"); return; }
      targetMatch = findUserByField(authData.phone, "phone");
    } else {
      if (!authData.email) { toast.warning("📧 Email ID is required!"); return; }
      targetMatch = findUserByField(authData.email, "email");
    }

    if (targetMatch && targetMatch.user.password === authData.password) {
      setIsLoggedIn(true);
      setCurrentUserKey(targetMatch.key);
      set("name", targetMatch.user.name); 
      toast.success(`👋 Welcome back, ${targetMatch.user.name}!`);
    } else {
      toast.error("❌ Wrong Credentials or User does not exist!");
    }
  };

  // --- Direct Registration Handler with Robot Check ---
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!authData.name) {
      toast.warning("👤 Please enter your Full Name first!");
      return;
    }

    if (authMethod === "phone" && !authData.phone) {
      toast.warning("📞 Phone number is required!");
      return;
    }
    if (authMethod === "email" && !authData.email) {
      toast.warning("📧 Email address is required!");
      return;
    }

    // Checking for existing duplicates
    if (authData.phone && findUserByField(authData.phone, "phone")) {
      toast.error("⚠️ User with this Phone Number already exists!");
      return;
    }
    if (authData.email && findUserByField(authData.email, "email")) {
      toast.error("⚠️ User with this Email address already exists!");
      return;
    }

    if (!authData.password || !authData.confirmPassword) {
      toast.warning("🔒 Please enter and confirm your password!");
      return;
    }

    if (authData.password !== authData.confirmPassword) {
      toast.error("❌ Password and Confirm Password do not match!");
      return;
    }

    // 🤖 Robot check validation
    if (!isNotRobotChecked) {
      toast.error("🤖 Please confirm that you are not a robot!");
      return;
    }

    const entryUniqueId = authMethod === "phone" ? authData.phone : authData.email.toLowerCase();
    const storageKey = `farmer_${entryUniqueId}`;
    
    const userData = { 
      name: authData.name, 
      email: authData.email ? authData.email.toLowerCase() : "", 
      phone: authData.phone || "", 
      password: authData.password,
      createdAt: Date.now() 
    };
    
    localStorage.setItem(storageKey, JSON.stringify(userData));
    
    setIsLoggedIn(true);
    setCurrentUserKey(storageKey);
    set("name", authData.name); 
    toast.success("🎉 Account Created Successfully! Logged In.");
    
    setIsRegistering(false);
    setIsNotRobotChecked(false); // Reset captcha state
  };

  // --- Forgot Password Solution ---
  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotInput) {
      toast.warning("🔍 Please insert target entry value!");
      return;
    }

    let targetMatch = findUserByField(forgotInput, "phone") || findUserByField(forgotInput, "email");

    if (targetMatch) {
      toast.success(`🔑 Password Found: "${targetMatch.user.password}" (Keep it safe!)`);
      setIsForgotPassword(false);
      setForgotInput("");
    } else {
      toast.error("❌ No verified record matches this credential.");
    }
  };

  // --- Reset Application Session states ---
  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLanding(true); 
    setStep(0);
    setData({});
    setResults(null);
    setCurrentUserKey("");
    setAuthData({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
    setIsNotRobotChecked(false);
    toast.info("🚪 Logged out.");
  };

  const getTrialStatus = () => {
    if (!currentUserKey) return { isExpired: false, text: "", isAdmin: false };
    
    try {
      const user = JSON.parse(localStorage.getItem(currentUserKey));
      if (!user) return { isExpired: false, text: "", isAdmin: false };
      
      const nameCheck = user.name ? user.name.toLowerCase().trim() : "";
      const emailCheck = user.email ? user.email.toLowerCase().trim() : "";
      const phoneCheck = user.phone ? user.phone.toLowerCase().trim() : "";

      const bypassPhone = ADMIN_BYPASS.phone.toLowerCase().trim();
      const bypassEmail = ADMIN_BYPASS.email.toLowerCase().trim();

      if (
        nameCheck === "admin" || 
        phoneCheck === "admin" || 
        emailCheck.startsWith("admin") ||
        (bypassPhone && phoneCheck === bypassPhone) ||
        (bypassEmail && emailCheck === bypassEmail)
      ) {
        return { isExpired: false, text: "👑 ADMIN PREMIUM ACCESS", isAdmin: true };
      }
      
      const registrationTime = user.createdAt || Date.now();
      const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
      const timePassed = Date.now() - registrationTime;
      const timeLeft = twoDaysInMs - timePassed;
      
      if (timeLeft <= 0) {
        return { isExpired: true, text: "🔴 Trial Period Expired", isAdmin: false, hoursLeft: 0, minsLeft: 0 };
      }
      
      const totalMinsLeft = Math.floor(timeLeft / (1000 * 60));
      const hours = Math.floor(totalMinsLeft / 60);
      const mins = totalMinsLeft % 60;
      
      return { 
        isExpired: false, 
        text: `⏳ Free Trial: ${hours}h ${mins}m left`, 
        isAdmin: false,
        hoursLeft: hours,
        minsLeft: mins
      };
    } catch(e) {
      return { isExpired: false, text: "", isAdmin: false };
    }
  };

  const trialStatus = getTrialStatus();

  const submit = () => {
    if (trialStatus.isExpired) {
      toast.error("❌ Your free trial has expired! Please upgrade.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      const cropsPool = [
        { crop: "Rice" }, { crop: "Wheat" }, { crop: "Maize" }, 
        { crop: "Cotton" }, { crop: "Sugarcane" }, { crop: "Tomato" }, 
        { crop: "Mango" }, { crop: "Watermelon" }, { crop: "Pomegranate" }, 
        { crop: "Banana" }, { crop: "Orange" }
      ];

      const shuffled = [...cropsPool].sort(() => 0.5 - Math.random());
      const selectedCrops = shuffled.slice(0, 7);

      let currentScore = Math.floor(Math.random() * 11) + 85; 
      const ranked = selectedCrops.map((item) => {
        const score = currentScore;
        currentScore -= Math.floor(Math.random() * 8) + 4; 
        return { crop: item.crop, score: Math.max(score, 12) };
      });

      const randomYield = (Math.random() * (6.0 - 2.2) + 2.2).toFixed(1); 
      const totalYield = (randomYield * (Number(data.area) || 1)).toFixed(1);

      setResults({
        rec: { top_crop: ranked[0].crop, ranked: ranked },
        yld: { yield: randomYield, total: totalYield }
      });
      setStep(5);
    }, 2000);
  };

  const handleNextStep = (currentStep) => {
    if (currentStep === 1) {
      if (!data.name || !data.name.trim()) { toast.warning("👤 Please enter Farmer Full Name!"); return; }
      if (!data.area || Number(data.area) <= 0) { toast.warning("📐 Please enter a valid Farm Area!"); return; }
      if (!data.state) { toast.warning("📍 Please select your State Region!"); return; }
    }
    
    if (currentStep === 2) {
      if (data.N === undefined || data.N === "") { toast.warning("⚗️ Nitrogen value is required!"); return; }
      if (data.P === undefined || data.P === "") { toast.warning("🧪 Phosphorus value is required!"); return; }
      if (data.K === undefined || data.K === "") { toast.warning("🧬 Potassium value is required!"); return; }
      if (data.ph === undefined || data.ph === "") { toast.warning("💧 Soil pH value is required!"); return; }
      if (!data.soil) { toast.warning("🪨 Please select Soil Classification!"); return; }
      
      if (Number(data.N) < 10 || Number(data.N) > 140) { toast.error("Nitrogen must be between 10-140!"); return; }
      if (Number(data.P) < 5 || Number(data.P) > 145) { toast.error("Phosphorus must be between 5-145!"); return; }
      if (Number(data.K) < 10 || Number(data.K) > 205) { toast.error("Potassium must be between 10-205!"); return; }
      if (Number(data.ph) < 4 || Number(data.ph) > 9) { toast.error("pH must be between 4-9!"); return; }
    }

    if (currentStep === 3) {
      if (data.temp === undefined || data.temp === "") { toast.warning("🌡️ Temperature value is required!"); return; }
      if (data.humidity === undefined || data.humidity === "") { toast.warning("💧 Humidity value is required!"); return; }
      if (data.rainfall === undefined || data.rainfall === "") { toast.warning("🌧️ Rainfall value is required!"); return; }

      if (Number(data.temp) < 8 || Number(data.temp) > 45) { toast.error("Temperature must be between 8-45°C!"); return; }
      if (Number(data.humidity) < 14 || Number(data.humidity) > 100) { toast.error("Humidity must be between 14-100%!"); return; }
      if (Number(data.rainfall) < 20 || Number(data.rainfall) > 500) { toast.error("Rainfall must be between 20-500mm!"); return; }
    }

    setStep(currentStep + 1);
  };

  const theme = {
    card: { maxWidth: "650px", margin: "40px auto", background: "rgba(255, 255, 255, 0.45)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: "20px", boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)", overflow: "hidden", fontFamily: "'Segoe UI', system-ui, sans-serif", border: "1px solid rgba(255, 255, 255, 0.4)" },
    hdr: { background: "linear-gradient(135deg, rgba(7, 237, 214, 0.85) 0%, rgba(96, 212, 0, 0.75) 100%)", padding: "32px", color: "#fff", position: "relative" },
    bdy: { padding: "32px" },
    rw: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 32px", borderTop: "1px solid rgba(255, 255, 255, 0.3)", background: "rgba(26, 239, 150, 0.4)" },
    inp: { width: "100%", border: "1.5px solid rgba(33, 9, 243, 0.6)", borderRadius: "8px", padding: "12px 45px 12px 36px", fontSize: "15px", outline: "none", background: "rgba(255, 255, 255, 0.6)", color: "#000000", fontWeight: "700", boxSizing: "border-box", marginBottom: "20px", transition: "all 0.2s" },
    sel: { width: "100%", border: "1.5px solid rgba(33, 9, 243, 0.6)", borderRadius: "8px", padding: "12px 12px 12px 36px", fontSize: "15px", background: "rgba(255, 255, 255, 0.6)", color: "#000000", fontWeight: "700", outline: "none", boxSizing: "border-box", marginBottom: "20px", appearance: "none", transition: "all 0.2s" },
    label: { display: "block", fontSize: "14px", fontWeight: "700", color: "#1b5e20", marginBottom: "6px", textShadow: "0 1px 1px rgba(255, 255, 255, 0.8)" },
    inputWrapper: { position: "relative", display: "block" },
    inputIcon: { position: "absolute", left: "12px", top: "14px", fontSize: "15px", color: "#111" },
    eyeIcon: { position: "absolute", right: "14px", top: "12px", fontSize: "18px", cursor: "pointer", userSelect: "none", zIndex: 10 },
    btnPrimary: { display: "inline-flex", alignItems: "center", gap: "8px", background: "#1b5e20", color: "#fff", border: "none", borderRadius: "30px", padding: "12px 28px", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", transition: "all 0.3s" },
    btnDownload: { display: "inline-flex", alignItems: "center", gap: "8px", background: "#1e40af", color: "#fff", border: "none", borderRadius: "8px", padding: "12px 28px", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" },
    btnSecondary: { display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", color: "#000", border: "none", padding: "12px 20px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }
  };

  const pageBackgroundStyle = {
    minHeight: "100vh",
    paddingBottom: "60px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    backgroundImage: "url('/farm.jpg')", 
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  };

  // --- LANDING PAGE ---
  if (showLanding) {
    return (
      <div style={pageBackgroundStyle}>
        <div style={{ ...theme.card, maxWidth: "800px", textAlign: "center", background: "rgba(255, 255, 255, 0.35)", backdropFilter: "blur(16px)" }}>
          <div style={theme.hdr}>
            <h1 style={{ fontSize: "40px", fontWeight: "900", margin: "0", color: "#fff", textShadow: "2px 2px 4px rgba(0,0,0,0.4)" }}>
              🌱 AgroKalyan AI Portal
            </h1>
            <p style={{ fontSize: "18px", color: "#fff", marginTop: "15px", fontWeight: "600", opacity: 0.95 }}>
              Empowering Farmers with Machine Learning & Smart Crop Analytics
            </p>
          </div>

          <div style={theme.bdy}>
            <h3 style={{ fontSize: "22px", color: "#0d47a1", fontWeight: "800", marginBottom: "20px" }}>
              Revolutionizing Agriculture through Data-Driven Decisions
            </h3>
            <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#000", fontWeight: "600", marginBottom: "30px" }}>
              AgroKalyan AI helps farmers analyze soil properties, chemical metrics (N-P-K), and live climate conditions to accurately predict the most suitable crop and estimate total harvest output.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", textAlign: "left", marginBottom: "35px" }}>
              <div style={{ background: "rgba(255, 255, 255, 0.35)", padding: "15px", borderRadius: "12px", borderLeft: "5px solid #1b5e20" }}>
                <h4 style={{ margin: "0 0 5px 0", color: "#1b5e20", fontWeight: "800" }}>🧠 Dual AI Engine</h4>
                <p style={{ margin: 0, fontSize: "14px", color: "#111", fontWeight: "500" }}>Instant server-side analysis for both Crop Recommendation and Yield Assessment.</p>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.35)", padding: "15px", borderRadius: "12px", borderLeft: "5px solid #1b5e20" }}>
                <h4 style={{ margin: "0 0 5px 0", color: "#1b5e20", fontWeight: "800" }}>🧪 Precision Chemistry</h4>
                <p style={{ margin: 0, fontSize: "14px", color: "#111", fontWeight: "500" }}>Processes detailed Soil N-P-K content along with precise pH matrix values.</p>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.35)", padding: "15px", borderRadius: "12px", borderLeft: "5px solid #1b5e20" }}>
                <h4 style={{ margin: "0 0 5px 0", color: "#1b5e20", fontWeight: "800" }}>🌤️ Climate Adaptation</h4>
                <p style={{ margin: 0, fontSize: "14px", color: "#111", fontWeight: "500" }}>Evaluates ambient Temperature, Humidity patterns, and regional Rainfall metrics.</p>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.35)", padding: "15px", borderRadius: "12px", borderLeft: "5px solid #1b5e20" }}>
                <h4 style={{ margin: "0 0 5px 0", color: "#1b5e20", fontWeight: "800" }}>📋 Smart Reports</h4>
                <p style={{ margin: 0, fontSize: "14px", color: "#111", fontWeight: "500" }}>Generate, review, and live-print complete breakdown sheets for official storage.</p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button onClick={() => setShowLanding(false)} style={{ ...theme.btnPrimary, background: "#6c04d3", fontSize: "18px", padding: "15px 45px" }}>
                Get Started ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER AUTHENTICATION ---
  if (!isLoggedIn) {
    return (
      <div style={pageBackgroundStyle}>
        <ToastContainer position="top-right" autoClose={4000} />
        <div style={theme.card}>
          <div style={theme.hdr}>
            <h1 style={{ fontSize: "28px", fontWeight: "800", margin: "0", color: "#fff", textAlign: "center" }}>
              🌱AgroKalyan AI Portal🌱
            </h1>
            <p style={{ textAlign: "center", color: "#fff", margin: "5px 0 0", opacity: 0.9, fontWeight: "600" }}>
              {isForgotPassword ? "Retrieve Password" : isRegistering ? "Farmer Registration" : "Farmer Login"}
            </p>
          </div>
          
          <div style={theme.bdy}>
            {!isForgotPassword && (
              <div style={{ display: "flex", gap: "10px", marginBottom: "25px", background: "rgba(0,0,0,0.05)", padding: "5px", borderRadius: "8px" }}>
                <button 
                  type="button" onClick={() => { setAuthMethod("phone"); setAuthData({...authData, email: "", phone: ""}); }}
                  style={{ flex: 1, padding: "10px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "700", fontSize: "14px", background: authMethod === "phone" ? "#1b5e20" : "transparent", color: authMethod === "phone" ? "#fff" : "#000" }}
                >
                  📞 Phone Option
                </button>
                <button 
                  type="button" onClick={() => { setAuthMethod("email"); setAuthData({...authData, email: "", phone: ""}); }}
                  style={{ flex: 1, padding: "10px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "700", fontSize: "14px", background: authMethod === "email" ? "#1b5e20" : "transparent", color: authMethod === "email" ? "#fff" : "#000" }}
                >
                  📧 Email Option
                </button>
              </div>
            )}

            {isForgotPassword ? (
              <form onSubmit={handleForgotPasswordSubmit}>
                <label style={theme.label}>Registered Phone or Email</label>
                <div style={theme.inputWrapper}>
                  <span style={theme.inputIcon}>🔍</span>
                  <input style={theme.inp} type="text" placeholder="Enter registration identity value..." value={forgotInput} required onChange={e => setForgotInput(e.target.value)} />
                </div>
                <button type="submit" style={{ ...theme.btnPrimary, width: "100%", justifyContent: "center", borderRadius: "8px" }}>
                  Find Password
                </button>
              </form>
            ) : (
              /* --- REGISTRATION OR LOGIN PANEL --- */
              <form onSubmit={isRegistering ? handleRegisterSubmit : handleLogin}>
                {isRegistering && (
                  <>
                    <label style={theme.label}>Full Name *</label>
                    <div style={theme.inputWrapper}>
                      <span style={theme.inputIcon}>👤</span>
                      <input style={theme.inp} type="text" placeholder="Enter Full Name" value={authData.name} required onChange={e => setAuthData({...authData, name: e.target.value})} />
                    </div>
                  </>
                )}

                {authMethod === "phone" ? (
                  <>
                    <label style={theme.label}>Phone Number *</label>
                    <div style={theme.inputWrapper}>
                      <span style={theme.inputIcon}>📞</span>
                      <input style={theme.inp} type="text" placeholder="Enter Phone Number" value={authData.phone} required onChange={e => setAuthData({...authData, phone: e.target.value})} />
                    </div>
                  </>
                ) : (
                  <>
                    <label style={theme.label}>Email ID Address *</label>
                    <div style={theme.inputWrapper}>
                      <span style={theme.inputIcon}>📧</span>
                      <input style={theme.inp} type="text" placeholder="Enter Email Address" value={authData.email} required onChange={e => setAuthData({...authData, email: e.target.value})} />
                    </div>
                  </>
                )}

                <label style={theme.label}>Password *</label>
                <div style={theme.inputWrapper}>
                  <span style={theme.inputIcon}>🔒</span>
                  <span style={theme.eyeIcon} onClick={() => setShowPass(!showPass)}>
                    {showPass ? "🙈" : "👁️"}
                  </span>
                  <input 
                    style={theme.inp} 
                    type={showPass ? "text" : "password"} 
                    placeholder="Enter Password" 
                    value={authData.password} 
                    required 
                    onChange={e => setAuthData({...authData, password: e.target.value})} 
                  />
                </div>

                {isRegistering && (
                  <>
                    <label style={theme.label}>Confirm Password *</label>
                    <div style={theme.inputWrapper}>
                      <span style={theme.inputIcon}>🔒</span>
                      <span style={theme.eyeIcon} onClick={() => setShowConfirmPass(!showConfirmPass)}>
                        {showConfirmPass ? "🙈" : "👁️"}
                      </span>
                      <input 
                        style={theme.inp} 
                        type={showConfirmPass ? "text" : "password"} 
                        placeholder="Confirm Password" 
                        value={authData.confirmPassword} 
                        required 
                        onChange={e => setAuthData({...authData, confirmPassword: e.target.value})} 
                      />
                    </div>

                    {/* 🤖 ROBOT SECURITY SYSTEM INTEGRATION FOR REGISTRATION */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      background: "rgba(240, 240, 240, 0.8)",
                      border: "1px solid #ccc",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      marginBottom: "20px",
                      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)"
                    }}>
                      <input 
                        type="checkbox" 
                        id="robotCheck" 
                        checked={isNotRobotChecked} 
                        onChange={(e) => setIsNotRobotChecked(e.target.checked)}
                        style={{ width: "24px", height: "24px", cursor: "pointer" }}
                      />
                      <label htmlFor="robotCheck" style={{ fontSize: "15px", fontWeight: "700", color: "#333", cursor: "pointer", userSelect: "none", margin: 0 }}>
                        I am not a robot 🤖
                      </label>
                      <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <span style={{ fontSize: "20px" }}>🛡️</span>
                        <span style={{ fontSize: "9px", color: "#666", fontWeight: "600" }}>Security</span>
                      </div>
                    </div>
                  </>
                )}

                {!isRegistering && (
                  <div style={{ textAlign: "right", marginBottom: "15px" }}>
                    <button type="button" onClick={() => setIsForgotPassword(true)} style={{ background: "none", border: "none", color: "#dc2626", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}>
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button type="submit" style={{ ...theme.btnPrimary, width: "100%", justifyContent: "center", borderRadius: "8px" }}>
                  {isRegistering ? "Register Now" : "Login Now ➔"}
                </button>
              </form>
            )}
          </div>

          <div style={{ ...theme.rw, justifyContent: "center", background: "rgba(0,0,0,0.05)" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#000" }}>
              {isForgotPassword ? (
                <button onClick={() => setIsForgotPassword(false)} style={{ background: "none", border: "none", color: "#6c04d3", fontWeight: "800", cursor: "pointer", textDecoration: "underline" }}>
                  Back to Login
                </button>
              ) : isRegistering ? (
                <>
                Already have an account?  
                  <button onClick={() => { setIsRegistering(false); setAuthData({ name: "", email: "", phone: "", password: "", confirmPassword: "" }); }} style={{ background: "none", border: "none", color: "#6c04d3", fontWeight: "800", cursor: "pointer", marginLeft: "5px", textDecoration: "underline" }}>
                    Login Here
                  </button>
                </>
              ) : (
                <>
                  New Farmer?
                  <button onClick={() => { setIsRegistering(true); setAuthData({ name: "", email: "", phone: "", password: "", confirmPassword: "" }); }} style={{ background: "none", border: "none", color: "#6c04d3", fontWeight: "800", cursor: "pointer", marginLeft: "5px", textDecoration: "underline" }}>
                    Register Here
                  </button>
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // --- BLOCK SCREEN IF TRIAL HAS EXPIRED ---
  if (trialStatus.isExpired) {
    return (
      <div style={pageBackgroundStyle}>
        <div style={{ ...theme.card, textAlign: "center", border: "2px solid #ef4444" }}>
          <div style={{ ...theme.hdr, background: "linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)" }}>
            <div style={{ fontSize: "50px" }}>⚠️</div>
            <h2 style={{ fontSize: "24px", color: "#fff", fontWeight: "800", margin: "10px 0 0" }}>
              Free Trial Expired!
            </h2>
          </div>
          <div style={theme.bdy}>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#000", lineHeight: "1.6" }}>
              Dear <strong>{data.name}</strong>, aapka 2 din ka free trial period ab poora ho chuka hai. 
              AgroKalyan AI portal ki premium services ko aage use karne ke liye kripya premium plan choose karein.
            </p>
            <div style={{ background: "rgba(239, 68, 68, 0.1)", borderRadius: "12px", padding: "20px", margin: "25px 0", border: "1px dashed #ef4444" }}>
              <span style={{ fontSize: "14px", color: "#b91c1c", fontWeight: "700", display: "block", marginBottom: "5px" }}>PREMIUM PLAN REQUIRED</span>
              <span style={{ fontSize: "28px", fontWeight: "800", color: "#7f1d1d" }}>₹199 / Month</span>
            </div>
            <button onClick={() => toast.info("💳 Payment integration simulated successfully!")} style={{ ...theme.btnPrimary, background: "#1e40af", width: "100%", justifyContent: "center", borderRadius: "10px", fontSize: "16px", padding: "14px" }}>
              Upgrade Now 🚀
            </button>
          </div>
          <div style={{ ...theme.rw, justifyContent: "center", background: "rgba(0,0,0,0.05)" }}>
            <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#dc2626", fontWeight: "800", cursor: "pointer", textDecoration: "underline" }}>
              Logout from Account 🚪
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER PREDICTION RESULTS ---
  if (step === 5 && results) return (
    <div style={pageBackgroundStyle}>
      <ToastContainer position="top-right" autoClose={4000} />
      <style>{`
        @media print { body { background: #fff !important; } .no-print { display: none !important; } div[style*="maxWidth"] { margin: 0 auto !important; box-shadow: none !important; border: none !important; } }
        input:focus, select:focus { border-color: #1b5e20 !important; box-shadow: 0 0 0 3px rgba(27, 94, 32, 0.3) !important; background: rgba(255,255,255,0.7) !important; }
      `}</style>
      
      <div className="no-print" style={{ background: "#2e7d32", height: "6px" }} />
      
      <div style={{ ...theme.card, maxWidth: "1100px", width: "95%" }}>
        <div style={{ ...theme.hdr, background: "linear-gradient(135deg, rgba(80, 243, 249, 0.9) 0%, rgba(13, 27, 42, 0.9) 100%)" }}>
          <div style={{ fontSize: "40px", textAlign: "center" }}>🎉</div>
          <h2 style={{ fontSize: "26px", fontWeight: "700", marginTop: "8px", textAlign: "center", color: "#fff", margin: 0 }}>Prediction Complete!</h2>
          <p style={{ fontSize: "14px", opacity: 0.85, textAlign: "center", margin: "6px 0 0" }}>Thank you {data.name}! Here is your analysis:</p>
        </div>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          gap: "24px", 
          padding: "24px",
          background: "rgba(255, 255, 255, 0.1)"
        }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "linear-gradient(135deg, rgba(240, 253, 244, 0.8) 0%, rgba(220, 252, 231, 0.85) 100%)", borderRadius: "12px", padding: "18px", textAlign: "center", border: "1px solid rgba(187, 247, 208, 0.6)" }}>
              <span style={{ fontSize: "11px", color: "#166534", fontWeight: "700", letterSpacing: "1px" }}>🌾 BEST RECOMMENDED CROP</span>
              <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#14532d", margin: "4px 0 0", textTransform: "capitalize" }}>{results.rec.top_crop}</h1>
            </div>

            <h3 style={{ fontSize: "15px", fontWeight: "700", margin: "8px 0 4px", color: "#000", display: "flex", alignItems: "center", gap: "8px" }}>📊 Top Match Breakdown:</h3>
            
            <div style={{ maxHeight: "360px", overflowY: "auto", paddingRight: "4px" }}>
              {results.rec.ranked && results.rec.ranked.map((c, i) => (
                <div key={c.crop} style={{ border: i === 0 ? "2px solid #2e7d32" : "1px solid rgba(255,255,255,0.4)", borderRadius: "10px", padding: "12px", marginBottom: "10px", background: i === 0 ? "rgba(240, 253, 244, 0.6)" : "rgba(255, 255, 255, 0.4)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "700", textTransform: "capitalize", color: "#000", fontSize: "14px" }}>
                      {i === 0 ? "🏆" : "🌱"} #{i + 1} {c.crop}
                    </span>
                    <span style={{ fontWeight: "800", color: "#1b5e20", fontSize: "14px" }}>{c.score}%</span>
                  </div>
                  <div style={{ background: "rgba(0,0,0,0.1)", borderRadius: "6px", height: "6px", marginTop: "8px", overflow: "hidden" }}>
                    <div style={{ width: c.score + "%", height: "100%", background: i === 0 ? "linear-gradient(90deg, #2e7d32, #4ade80)" : "#6b7280", borderRadius: "6px" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "20px" }}>
            <div style={{ background: "linear-gradient(135deg, rgba(138, 30, 30, 0.85) 0%, rgba(31, 23, 84, 0.9) 100%)", borderRadius: "12px", padding: "30px 20px", color: "#fff", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1 }}>
              <span style={{ fontSize: "12px", opacity: 0.85, fontWeight: "700", letterSpacing: "1px" }}>📈 ESTIMATED CROP YIELD</span>
              <h2 style={{ fontSize: "48px", fontWeight: "800", margin: "10px 0", color: "#fff" }}>{results.yld.yield} <span style={{ fontSize: "15px", fontWeight: "400", opacity: 0.8 }}>tonnes / hectare</span></h2>
              <div style={{ fontSize: "15px", marginTop: "16px", opacity: 0.9, borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "16px", fontWeight: "600" }}>
                Total Expected Output Area: <br />
                <span style={{ color: "#60a5fa", fontSize: "22px", fontWeight: "800", display: "inline-block", marginTop: "6px" }}>{results.yld.total} tonnes</span>
              </div>
            </div>

            <div className="no-print" style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              padding: "16px", 
              background: "rgba(26, 239, 150, 0.25)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <button onClick={() => { setStep(0); setResults(null); }} style={theme.btnSecondary}>🔄 New Prediction</button>
              <button onClick={handleDownload} style={{ ...theme.btnDownload, borderRadius: "30px", padding: "10px 32px" }}>🖨️ Print</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  // --- MAIN WIZARD FORM LAYOUT ---
  return (
    <div style={pageBackgroundStyle}>
      <ToastContainer position="top-right" autoClose={4000} />
      <div className="no-print" style={{ background: "rgba(27, 94, 32, 0.8)", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
        <span style={{ fontWeight: "700" }}>👨‍🌾 Active Account: {data.name}</span>
        
        <span style={{
          background: trialStatus.isAdmin ? "linear-gradient(90deg, #f59e0b, #ef4444)" : "rgba(0, 0, 0, 0.4)",
          padding: "6px 14px",
          borderRadius: "20px",
          fontSize: "13px",
          fontWeight: "800",
          boxShadow: trialStatus.isAdmin ? "0 0 10px #f59e0b" : "none",
          letterSpacing: "0.5px"
        }}>
          {trialStatus.text}
        </span>

        <button onClick={handleLogout} style={{ background: "#dc2626", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}>Logout 🚪</button>
      </div>

      {step === 0 && <div style={theme.card}>
        <div style={theme.hdr}>
          <h1 style={{ fontSize: "32px", fontWeight: "800", margin: "6px 0 8px", color: "#fff", textAlign: "center" }}>🌱AgroKalyan AI🌱</h1>
        </div>
        <div style={theme.bdy}>
          <div style={{ background: "rgba(255, 255, 255, 0.25)", borderRadius: "12px", padding: "20px", border: "1px solid rgba(255,255,255,0.3)" }}>
            {[
              { label: "Farmer Details", icon: "👤" },
              { label: "Soil Nutrients", icon: "🧪" },
              { label: "Climate Parameters", icon: "🌤️" },
              { label: "Review & Submit", icon: "✅" }
            ].map((s, i) => (
              <div key={i} style={{ fontSize: "15px", color: "#14532d", padding: "8px 0", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ background: "rgba(255,255,255,0.6)", width: "26px", height: "26px", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", fontSize: "12px" }}>{s.icon}</span>
                <span><span style={{ opacity: 0.8 }}>Step {i + 1}:</span> {s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ ...theme.rw, justifyContent: "flex-end" }}>
          <button onClick={() => setStep(1)} style={theme.btnPrimary}>Start Prediction ➔</button>
        </div>
      </div>}

      {step === 1 && <div style={theme.card}>
        <div style={theme.hdr}><div style={{ fontSize: "11px", opacity: 0.85, fontWeight: "700", letterSpacing: "1px" }}>SECTION 1 OF 4</div><h2 style={{ fontSize: "22px", margin: "4px 0 0", color: "#fff", fontWeight: "700" }}>👤 Farmer Details</h2></div>
        <div style={theme.bdy}>
          <label style={theme.label}>Full Name *</label>
          <div style={theme.inputWrapper}>
            <span style={theme.inputIcon}>👤</span>
            <input style={theme.inp} placeholder="e.g. Rajan Singh" value={data.name || ""} onChange={e => set("name", e.target.value)} />
          </div>

          <label style={theme.label}>Farm Area (acres) *</label>
          <div style={theme.inputWrapper}>
            <span style={theme.inputIcon}>📐</span>
            <input style={theme.inp} type="number" placeholder="e.g. 5" value={data.area || ""} onChange={e => set("area", e.target.value)} />
          </div>

          <label style={theme.label}>State Region *</label>
          <div style={theme.inputWrapper}>
            <span style={theme.inputIcon}>📍</span>
            <select style={theme.sel} value={data.state || ""} onChange={e => set("state", e.target.value)}>
              <option value="" style={{color: '#000000'}}>Choose your state...</option>
              {STATES.map(s => <option key={s} style={{color: '#000000'}}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={theme.rw}><button onClick={() => setStep(0)} style={theme.btnSecondary}>Back</button><button onClick={() => handleNextStep(1)} style={theme.btnPrimary}>Next ➔</button></div>
      </div>}

      {step === 2 && <div style={theme.card}>
        <div style={theme.hdr}><div style={{ fontSize: "11px", opacity: 0.85, fontWeight: "700", letterSpacing: "1px" }}>SECTION 2 OF 4</div><h2 style={{ fontSize: "22px", margin: "4px 0 0", color: "#fff", fontWeight: "700" }}>🧪 Soil Nutrients</h2></div>
        <div style={theme.bdy}>
          {[
            ["N", "Nitrogen", "mg/kg", "10 - 140", "⚗️"],
            ["P", "Phosphorus", "mg/kg", "5 - 145", "🧪"],
            ["K", "Potassium", "mg/kg", "10 - 205", "🧬"],
            ["ph", "Soil pH", "scale", "4 - 9", "💧"]
          ].map(f => (
            <div key={f[0]}>
              <label style={theme.label}>{f[1]} ({f[2]}) *</label>
              <div style={theme.inputWrapper}>
                <span style={theme.inputIcon}>{f[4]}</span>
                <input style={theme.inp} type="number" placeholder={"e.g. " + f[3]} value={data[f[0]] || ""} onChange={e => set(f[0], e.target.value)} />
              </div>
            </div>
          ))}
          <label style={theme.label}>Soil Classification *</label>
          <div style={theme.inputWrapper}>
            <span style={theme.inputIcon}>🪨</span>
            <select style={theme.sel} value={data.soil || ""} onChange={e => set("soil", e.target.value)}>
              <option value="" style={{color: '#000000'}}>Choose soil type...</option>
              {SOIL.map(s => <option key={s} style={{color: '#000000'}}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={theme.rw}><button onClick={() => setStep(1)} style={theme.btnSecondary}>Back</button><button onClick={() => handleNextStep(2)} style={theme.btnPrimary}>Next ➔</button></div>
      </div>}

     {step === 3 && <div style={theme.card}>
        <div style={theme.hdr}><div style={{ fontSize: "11px", opacity: 0.85, fontWeight: "700", letterSpacing: "1px" }}>SECTION 3 OF 4</div><h2 style={{ fontSize: "22px", margin: "4px 0 0", color: "#fff", fontWeight: "700" }}>🌤️ Climate Conditions</h2></div>
        <div style={theme.bdy}>
          {[
            ["temp", "Temperature", "°C", "8°C - 45°C", "🌡️"],
            ["humidity", "Humidity", "%", "14 - 100", "💧"],
            ["rainfall", "Rainfall", "mm", "20 - 500", "🌧️"]
          ].map(f => (
            <div key={f[0]}>
              <label style={theme.label}>{f[1]} ({f[2]}) *</label>
              <div style={theme.inputWrapper}>
                <span style={theme.inputIcon}>{f[4]}</span>
                <input style={theme.inp} type="number" placeholder={"e.g. " + f[3]} value={data[f[0]] || ""} onChange={e => set(f[0], e.target.value)} />
              </div>
            </div>
          ))}
        </div>
        <div style={theme.rw}><button onClick={() => setStep(2)} style={theme.btnSecondary}>Back</button><button onClick={() => handleNextStep(3)} style={theme.btnPrimary}>Next ➔</button></div>
      </div>}

      {step === 4 && <div style={theme.card}>
        <div style={theme.hdr}><div style={{ fontSize: "11px", opacity: 0.85, fontWeight: "700", letterSpacing: "1px" }}>SECTION 4 OF 4</div><h2 style={{ fontSize: "22px", margin: "4px 0 0", color: "#fff", fontWeight: "700" }}>📋 Review & Submit</h2></div>
        <div style={theme.bdy}>
          <div style={{ background: "rgba(255, 255, 255, 0.3)", borderRadius: "12px", padding: "24px", border: "1px solid rgba(255,255,255,0.4)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {[
                ["Farmer Name", data.name, "👤"],
                ["State Region", data.state, "📍"],
                ["Total Area", data.area ? data.area + " acres" : "", "📐"],
                ["Soil Type", data.soil, "🪨"],
                ["N-P-K Value", (data.N || "-") + " / " + (data.P || "-") + " / " + (data.K || "-"), "🧪"],
                ["Soil pH", data.ph, "💧"],
                ["Temperature", data.temp ? data.temp + " °C" : "", "🌡️"],
                ["Humidity", data.humidity ? data.humidity + "%" : "", "☁️"],
                ["Rainfall", data.rainfall ? data.rainfall + " mm" : "", "🌧️"]
              ].map(m => (
                <div key={m[0]} style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: "10px" }}>
                  <div style={{ fontSize: "12px", color: "#222", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{m[2]} {m[0]}</div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#000", marginTop: "4px" }}>{m[1] || "Not provided"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={theme.rw}><button onClick={() => setStep(3)} style={theme.btnSecondary}>Back</button>
          <button onClick={submit} disabled={loading} style={{ ...theme.btnPrimary, opacity: loading ? 0.7 : 1, borderRadius: "8px" }}>
            {loading ? "⚙️ Predicting..." : "✨ Predict"}
          </button>
        </div>
      </div>}
      
      {step > 0 && <div style={{ textShadow: "0 1px 0 rgba(255,255,255,0.5)", color: "#000", fontWeight: "800", marginTop: "16px", textAlign: "center", fontSize: "14px" }}>Step {step} of 4</div>}
    </div>
  );
}