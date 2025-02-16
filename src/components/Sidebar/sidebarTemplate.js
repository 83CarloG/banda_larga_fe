export function getTemplate() {
    return `
                  <button class="menu-toggle" aria-label="Toggle menu">☰</button>
            <nav class="sidebar">
                <ul>
                    <li><a href="/dashboard">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px">
                            <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
                        </svg>
                        Home
                    </a></li>
                    <li><a href="#">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 8px" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <!-- Central hub -->
                          <circle cx="12" cy="12" r="3" />
                          <!-- Radiating lines -->
                          <line x1="12" y1="2" x2="12" y2="6" />
                          <line x1="12" y1="18" x2="12" y2="22" />
                          <line x1="2" y1="12" x2="6" y2="12" />
                          <line x1="18" y1="12" x2="22" y2="12" />
                          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                        </svg>
                        Centri
                    </a></li>
                    <li><a href="/users">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        Utenti
                    </a></li>
                    <li><a href="#">                     
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="margin-right: 8px">
                            <path d="M7 11c1.66 0 3-1.34 3-3S8.66 5 7 5S4 6.34 4 8s1.34 3 3 3zm0 1.5c-2 0-6 1-6 3V17h12v-1.5c0-2-4-3-6-3z" fill="black"/>
                            <path d="M12 11c1.66 0 3-1.34 3-3S13.66 5 12 5S9 6.34 9 8s1.34 3 3 3zm0 1.5c-2 0-6 1-6 3V17h12v-1.5c0-2-4-3-6-3z" fill="black" opacity="0.7"/>                            
                            <path d="M17 11c1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3s1.34 3 3 3zm0 1.5c-2 0-6 1-6 3V17h12v-1.5c0-2-4-3-6-3z" fill="black" opacity="0.4"/>
                        </svg>
                        Ospiti
                    </a></li>
                    <li><a href="#">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 8px" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <!-- Document outline with a folded top-right corner -->
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <!-- Internal bar chart to represent report data -->
                          <rect x="8" y="14" width="2" height="4" fill="currentColor" stroke="none"/>
                          <rect x="11" y="12" width="2" height="6" fill="currentColor" stroke="none"/>
                          <rect x="14" y="10" width="2" height="8" fill="currentColor" stroke="none"/>
                        </svg>
                        Report
                    </a></li>                    
                </ul>
            </nav>`;
}