// Status bar dynamic updates
function getWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - start) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + start.getDay() + 1) / 7);
}
function randomCommit() { return Math.random().toString(36).substring(2, 8); }
function updateStatusBar() {
  document.getElementById('weekNum').innerText = `WEEK ${getWeekNumber()}`;
  document.getElementById('altarStatus').innerText = 'OFFLINE';
  document.getElementById('ozaynStatus').innerText = 'ONLINE';
  document.getElementById('commitHash').innerText = randomCommit();
}
setInterval(updateStatusBar, 5000);
updateStatusBar();

// Blog data
const blogData = [
  { date: "2025-04-25", title: "Embedded Iris Scanner Prototype", tag: "hardware", summary: "First light test of the biometric capture unit, reaching 99.6% accuracy.", icon: "fas fa-fingerprint", link: "#" },
  { date: "2025-04-18", title: "Ozayn Digital Twin Core v0.2", tag: "AI", summary: "Simulation of urban infrastructure resilience with real-time city data.", icon: "fas fa-microchip", link: "#" },
  { date: "2025-04-04", title: "Military-grade encryption module", tag: "hardware", summary: "Integration of TRNG and post-quantum cryptography.", icon: "fas fa-shield-alt", link: "#" },
  { date: "2025-03-28", title: "Facial Recognition Pipeline for Fayda", tag: "AI", summary: "Edge AI deployment on low-power ARM cores.", icon: "fas fa-face-smile", link: "#" }
];

function renderBlogCards(filter = "all") {
  const container = document.getElementById('blogCards');
  if (!container) return;
  const filtered = filter === "all" ? blogData : blogData.filter(b => b.tag.toLowerCase() === filter.toLowerCase());
  container.innerHTML = filtered.map(post => `
    <div class="blog-card">
      <div class="blog-img"><i class="${post.icon}" style="font-size:3rem;"></i></div>
      <div class="blog-card-content">
        <span class="blog-tag-sm">📅 ${post.date} · ${post.tag.toUpperCase()}</span>
        <div class="blog-title-sm"><strong>${post.title}</strong></div>
        <div class="blog-summary-sm">${post.summary}</div>
        <a href="${post.link}" class="blog-link">Read more →</a>
      </div>
    </div>
  `).join('');
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderBlogCards(btn.getAttribute('data-tag'));
  });
});
renderBlogCards('all');

// Dashboard metrics
const startProjectDate = new Date(2026, 3, 26); // April 26 2026
const endAllProjects = new Date(2027, 11, 31);  // Dec 31 2027
const totalProjectDuration = endAllProjects - startProjectDate;

function updateDashboard() {
  const now = new Date();
  document.getElementById('projectCount').innerText = "8";
  
  // Time left in current day
  const endOfDay = new Date(now);
  endOfDay.setHours(23,59,59,999);
  const diffDay = endOfDay - now;
  const hoursLeft = Math.floor(diffDay / (1000*60*60));
  const minsLeft = Math.floor((diffDay % (3600000)) / 60000);
  const secsLeft = Math.floor((diffDay % 60000) / 1000);
  document.getElementById('timeLeftDay').innerText = `${hoursLeft}h ${minsLeft}m ${secsLeft}s`;
  
  // Accomplished percent
  const daysSinceStart = (now - startProjectDate) / (1000*3600*24);
  const totalDays = totalProjectDuration / (1000*3600*24);
  let percent = (daysSinceStart / totalDays) * 100;
  percent = Math.min(100, Math.max(0, percent)).toFixed(1);
  document.getElementById('accomplishedPercent').innerText = `${percent}%`;
  
  // Total time left for all projects
  const remaining = endAllProjects - now;
  if (remaining > 0) {
    const weeks = Math.floor(remaining / (1000*3600*24*7));
    const days = Math.floor((remaining % (1000*3600*24*7)) / (1000*3600*24));
    const hours = Math.floor((remaining % (1000*3600*24)) / (1000*3600));
    document.getElementById('totalTimeLeft').innerText = `${weeks}w ${days}d ${hours}h`;
  } else {
    document.getElementById('totalTimeLeft').innerText = "Completed";
  }
}
setInterval(updateDashboard, 1000);
updateDashboard();

// Smooth scroll for navigation links
document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
