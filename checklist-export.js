/**
 * IBOGA CARE PORTUGAL - PREPARATION CHECKLIST EXPORT
 * Production-ready code with fallbacks for all export methods
 */

// ============================================================================
// 1. GOOGLE CALENDAR EXPORT
// ============================================================================

function addToGoogleCalendar() {
  const events = [
    {
      title: 'Iboga Care - Gather Required Documents',
      description: 'Documents to collect:\n\n• Passport (6+ months valid if international)\n• Government ID\n• Medical screening results (copies)\n• Health insurance card\n• Approved medications (original containers)\n• Emergency contacts\n• Travel insurance docs\n• Cash (small amount)\n• Credit/debit card',
      start: '20250215T090000Z',
      end: '20250215T100000Z'
    },
    {
      title: 'Iboga Care - Pack Clothing Essentials',
      description: 'Clothing to pack:\n\n• Loose comfortable clothing (soft pants, loose shirts, layers)\n• Warm layers (evenings cool)\n• Comfortable socks (multiple pairs)\n• Lightweight robe\n• Walking shoes and sandals\n• Sleepwear\n• Underwear (7-10 days)\n• Light rain jacket\n• Hat and sunglasses',
      start: '20250220T090000Z',
      end: '20250220T100000Z'
    },
    {
      title: 'Iboga Care - Ceremony Essentials',
      description: 'For the ceremony:\n\n• Journal and pens (multiple)\n• Small notebook\n• Eye mask (if preferred)\n• Water bottle (reusable)\n• Small flashlight/headlamp',
      start: '20250225T090000Z',
      end: '20250225T100000Z'
    },
    {
      title: 'Iboga Care - Optional Meaningful Items',
      description: 'Consider bringing:\n\n• Books (meaningful, not just distracting)\n• E-reader (pre-loaded, airplane mode)\n• Photos of loved ones\n• Art supplies (some process visually)\n• Mala beads or meaningful object',
      start: '20250228T090000Z',
      end: '20250228T100000Z'
    },
    {
      title: 'Iboga Care - Review Prohibited Items',
      description: 'DO NOT BRING:\n\n✗ Alcohol or drugs\n✗ Unapproved supplements\n✗ Work laptop\n✗ Excessive technology\n✗ Valuable jewelry\n✗ Heavy books',
      start: '20250301T090000Z',
      end: '20250301T100000Z'
    },
    {
      title: 'Iboga Care - Technology Guidelines',
      description: 'Important guidelines:\n\nPhone: Bring for travel/emergencies, surrender during ceremony, airplane mode during retreat\n\nCamera: Permitted for nature walks, never during ceremony\n\nBe present—don\'t live through a lens',
      start: '20250303T090000Z',
      end: '20250303T100000Z'
    }
  ];
  
  // Apre ogni evento in una nuova tab (Google Calendar gestisce bene tabs multiple)
  events.forEach((event, index) => {
    setTimeout(() => {
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&dates=${event.start}/${event.end}&ctz=Europe/Lisbon`;
      window.open(url, '_blank');
    }, index * 300); // Delay 300ms tra ogni apertura per non sovraccaricare browser
  });
  
  showToast('✓ Opening Google Calendar...', 3000);
}

// ============================================================================
// 2. APPLE REMINDERS EXPORT (via .ics file)
// ============================================================================

function addToAppleReminders() {
  // Device detection
  const isAppleDevice = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
  
  if (!isAppleDevice) {
    // Non è un device Apple - mostra alert e fallback
    const proceed = confirm(
      "Apple Reminders works on iOS and macOS devices only.\n\n" +
      "You're using a different device. Would you like to copy the checklist to your clipboard instead?\n\n" +
      "Click OK to copy, or Cancel to choose another export method."
    );
    
    if (proceed) {
      copyToClipboard();
    }
    return;
  }
  
  // È un device Apple - genera file .ics
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Iboga Care Portugal//Preparation Checklist//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH

BEGIN:VTODO
UID:iboga-prep-1@ibogacare.pt
DTSTAMP:20250117T120000Z
SUMMARY:Gather required documents
DESCRIPTION:Documents to collect:\\n\\n• Passport (6+ months valid if international)\\n• Government ID\\n• Medical screening results (copies)\\n• Health insurance card\\n• Approved medications (original containers)\\n• Emergency contacts\\n• Travel insurance docs\\n• Cash (small amount)\\n• Credit/debit card
PRIORITY:1
STATUS:NEEDS-ACTION
CATEGORIES:PREPARATION,DOCUMENTS
END:VTODO

BEGIN:VTODO
UID:iboga-prep-2@ibogacare.pt
DTSTAMP:20250117T120000Z
SUMMARY:Pack clothing essentials
DESCRIPTION:Clothing to pack:\\n\\n• Loose comfortable clothing (soft pants, loose shirts, layers)\\n• Warm layers (evenings cool)\\n• Comfortable socks (multiple pairs)\\n• Lightweight robe\\n• Walking shoes and sandals\\n• Sleepwear\\n• Underwear (7-10 days)\\n• Light rain jacket\\n• Hat and sunglasses
PRIORITY:2
STATUS:NEEDS-ACTION
CATEGORIES:PREPARATION,CLOTHING
END:VTODO

BEGIN:VTODO
UID:iboga-prep-3@ibogacare.pt
DTSTAMP:20250117T120000Z
SUMMARY:Ceremony essentials
DESCRIPTION:For the ceremony:\\n\\n• Journal and pens (multiple)\\n• Small notebook\\n• Eye mask (if preferred)\\n• Water bottle (reusable)\\n• Small flashlight/headlamp
PRIORITY:1
STATUS:NEEDS-ACTION
CATEGORIES:PREPARATION,CEREMONY
END:VTODO

BEGIN:VTODO
UID:iboga-prep-4@ibogacare.pt
DTSTAMP:20250117T120000Z
SUMMARY:Optional meaningful items
DESCRIPTION:Consider bringing:\\n\\n• Books (meaningful, not just distracting)\\n• E-reader (pre-loaded, airplane mode)\\n• Photos of loved ones\\n• Art supplies (some process visually)\\n• Mala beads or meaningful object
PRIORITY:3
STATUS:NEEDS-ACTION
CATEGORIES:PREPARATION,OPTIONAL
END:VTODO

BEGIN:VTODO
UID:iboga-prep-5@ibogacare.pt
DTSTAMP:20250117T120000Z
SUMMARY:Review prohibited items
DESCRIPTION:DO NOT BRING:\\n\\n✗ Alcohol or drugs\\n✗ Unapproved supplements\\n✗ Work laptop\\n✗ Excessive technology\\n✗ Valuable jewelry\\n✗ Heavy books
PRIORITY:1
STATUS:NEEDS-ACTION
CATEGORIES:PREPARATION,IMPORTANT
END:VTODO

BEGIN:VTODO
UID:iboga-prep-6@ibogacare.pt
DTSTAMP:20250117T120000Z
SUMMARY:Technology guidelines
DESCRIPTION:Important guidelines:\\n\\nPhone: Bring for travel/emergencies, surrender during ceremony, airplane mode during retreat\\n\\nCamera: Permitted for nature walks, never during ceremony\\n\\nBe present—don't live through a lens
PRIORITY:2
STATUS:NEEDS-ACTION
CATEGORIES:PREPARATION,GUIDELINES
END:VTODO

END:VCALENDAR`;

  try {
    // Crea blob e trigger download
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'iboga-care-preparation.ics';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    showToast('✓ Opening in Apple Reminders...', 3000);
  } catch (error) {
    console.error('Apple Reminders export failed:', error);
    alert('Unable to create reminder file. Please try "Copy to Clipboard" instead.');
    copyToClipboard();
  }
}

// ============================================================================
// 3. TODOIST EXPORT
// ============================================================================

function addToTodoist() {
  const hasAccount = confirm(
    "Add preparation checklist to Todoist?\n\n" +
    "This will open Todoist in your browser. If you don't have an account, you'll be prompted to create one (free).\n\n" +
    "Click OK to continue, or Cancel to copy the checklist instead."
  );
  
  if (!hasAccount) {
    copyToClipboard();
    return;
  }
  
  const tasks = [
    'Gather required documents: Passport, ID, medical results, insurance, emergency contacts @Iboga_Care !p1',
    'Pack clothing essentials: Comfortable layers, warm clothes, walking shoes, sleepwear @Iboga_Care !p2',
    'Ceremony items: Journal, notebook, eye mask, water bottle, flashlight @Iboga_Care !p1',
    'Optional meaningful items: Books, e-reader, photos, art supplies, mala beads @Iboga_Care !p3',
    'Review prohibited items: NO alcohol, drugs, supplements, work laptop, excessive tech @Iboga_Care !p1',
    'Technology guidelines: Phone for emergencies only, airplane mode during retreat @Iboga_Care !p2'
  ];
  
  // Apre Todoist con quick-add per ogni task
  tasks.forEach((task, index) => {
    setTimeout(() => {
      const url = `https://todoist.com/app/quick-add?text=${encodeURIComponent(task)}`;
      window.open(url, '_blank');
    }, index * 500); // Delay 500ms per non sovraccaricare browser
  });
  
  showToast('✓ Opening Todoist...', 3000);
}

// ============================================================================
// 4. COPY TO CLIPBOARD (Triplo Fallback)
// ============================================================================

function copyToClipboard() {
  const text = `IBOGA CARE PORTUGAL - PREPARATION CHECKLIST

📄 DOCUMENTS
☐ Passport (6+ months valid if international)
☐ Government ID
☐ Medical screening results (copies)
☐ Health insurance card
☐ Approved medications (original containers)
☐ Emergency contacts
☐ Travel insurance docs
☐ Cash (small amount)
☐ Credit/debit card

👕 CLOTHING
☐ Loose comfortable clothing (soft pants, loose shirts, layers)
☐ Warm layers (evenings cool)
☐ Comfortable socks (multiple pairs)
☐ Lightweight robe
☐ Walking shoes and sandals
☐ Sleepwear
☐ Underwear (7-10 days)
☐ Light rain jacket
☐ Hat and sunglasses

📅 FOR CEREMONY
☐ Journal and pens (multiple)
☐ Small notebook
☐ Eye mask (if preferred)
☐ Water bottle (reusable)
☐ Small flashlight/headlamp

✅ OPTIONAL ITEMS
☐ Books (meaningful, not just distracting)
☐ E-reader (pre-loaded, airplane mode)
☐ Photos of loved ones
☐ Art supplies (some process visually)
☐ Mala beads or meaningful object

❌ DO NOT BRING
✗ Alcohol or drugs
✗ Unapproved supplements
✗ Work laptop
✗ Excessive technology
✗ Valuable jewelry
✗ Heavy books

📱 TECHNOLOGY GUIDELINES
Phone: Bring for travel/emergencies, surrender during ceremony, airplane mode during retreat
Camera: Permitted for nature walks, never during ceremony
Be present—don't live through a lens`;

  // METODO 1: Clipboard API moderna (preferita)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast('✓ Copied to clipboard!', 3000);
      })
      .catch(err => {
        console.error('Clipboard API failed:', err);
        fallbackCopy(text);
      });
  } else {
    // METODO 2: Fallback per browser vecchi
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (successful) {
      showToast('✓ Copied to clipboard!', 3000);
    } else {
      // METODO 3: Ultimo fallback - mostra modal con testo selezionabile
      showManualCopyModal(text);
    }
  } catch (err) {
    console.error('Fallback copy failed:', err);
    showManualCopyModal(text);
  }
}

function showManualCopyModal(text) {
  const modal = document.createElement('div');
  modal.innerHTML = `
    <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;">
      <div style="background:white;padding:30px;border-radius:12px;max-width:600px;width:100%;max-height:90vh;overflow:auto;box-sizing:border-box;">
        <h3 style="margin:0 0 15px 0;font-size:20px;color:#1a1a1a;">Copy Checklist</h3>
        <p style="margin:0 0 15px 0;color:#666;font-size:14px;">Please select and copy the text below:</p>
        <textarea readonly style="width:100%;height:300px;padding:12px;border:1px solid #ddd;border-radius:6px;font-family:monospace;font-size:12px;line-height:1.5;resize:vertical;box-sizing:border-box;">${text}</textarea>
        <button onclick="this.closest('div').parentElement.remove()" style="margin-top:15px;padding:10px 20px;background:#22c55e;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:500;font-size:14px;">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Auto-select textarea
  const textarea = modal.querySelector('textarea');
  textarea.focus();
  textarea.select();
}

// ============================================================================
// TOAST NOTIFICATION HELPER
// ============================================================================

function showToast(message, duration = 3000) {
  // Remove existing toast if present
  const existingToast = document.querySelector('.iboga-toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'iboga-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #22c55e;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    animation: slideIn 0.3s ease;
    max-width: 300px;
  `;
  
  // Add animation keyframes if not already present
  if (!document.querySelector('#iboga-toast-styles')) {
    const style = document.createElement('style');
    style.id = 'iboga-toast-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(toast);
  
  // Auto-remove after duration
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================================================
// INITIALIZATION (Optional - if you want to add event listeners on page load)
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('Iboga Care Checklist Export - Ready');
});
