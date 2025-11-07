
    function showToast(message) {
      const toast = document.getElementById("toast");
      toast.textContent = message;
      toast.className = "toast show";
      setTimeout(() => {
        toast.className = toast.className.replace("show", "");
      }, 1500);
    }

    function togglePasswordVisibility() {
      const passwordInput = document.getElementById("password");
      passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    }

    async function login(event) {
      event.preventDefault();

      const userId = document.getElementById("userid").value.trim();
      const password = document.getElementById("password").value;
      const errorMsg = document.getElementById("errorMsg");
      const loadingScreen = document.getElementById("loadingScreen");

      if (!userId || !password) {
        errorMsg.textContent = "Enter both User ID and Password.";
        return;
      }

      errorMsg.textContent = ""; // Clear old errors
      loadingScreen.style.display = "flex"; // Show loading screen

      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify({ userid: userId, password: password })
        });

        const result = await response.json();
        setTimeout(() => {
          loadingScreen.style.display = "none";
          if (result.success) {
            window.location.href = "/menu";
          } else {
            errorMsg.textContent = result.message;
          }
        }, 800);
      } catch (error) {
        setTimeout(() => {
          loadingScreen.style.display = "none";
          errorMsg.textContent = "Server error. Please try again later.";
        }, 800);
      }
    }

    function openChangePassword() {
      document.getElementById("changePasswordPopup").style.display = "flex";
    }

    function closeChangePassword() {
      document.getElementById("changePasswordPopup").style.display = "none";
      document.getElementById("cp_error").textContent = "";
    }

    async function submitPasswordChange(event) {
      event.preventDefault();
      const userid = document.getElementById("cp_userid").value.trim();
      const oldPassword = document.getElementById("cp_old").value;
      const newPassword = document.getElementById("cp_new").value;
      const confirmPassword = document.getElementById("cp_confirm").value;
      const errorDiv = document.getElementById("cp_error");

      if (newPassword !== confirmPassword) {
        errorDiv.textContent = "New passwords do not match.";
        return;
      }

      const res = await fetch("/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, old_password: oldPassword, new_password: newPassword })
      });

      const result = await res.json();
      if (result.success) {
        showToast("✅ Password Changed !!!");
        setTimeout(() => location.reload(), 1500);
        closeChangePassword();
      } else {
        errorDiv.textContent = result.message || "Failed to change password.";
      }
    }

    window.addEventListener("DOMContentLoaded", () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("expired") === "1") {
        showToast("🔒 Session Expired !!!");
      }
    });