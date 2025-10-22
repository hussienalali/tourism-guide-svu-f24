(function(){
  const searchInput = document.getElementById('eventSearchInput');
  const dateInput = document.getElementById('dateFilter');
  const categorySelect = document.getElementById('categoryFilter');
  const locationInput = document.getElementById('locationFilter');

  function filterEvents() {
    const search = (searchInput && searchInput.value) ? searchInput.value.trim().toLowerCase() : '';
    const date = dateInput ? dateInput.value : '';
    const category = categorySelect ? categorySelect.value : '';
    const location = (locationInput && locationInput.value) ? locationInput.value.trim().toLowerCase() : '';
    const cards = document.querySelectorAll('.Events .card');
    cards.forEach(card => {
      let text = card.innerText.toLowerCase();
      let show = true;
      if (search && !text.includes(search)) show = false;
      if (date && !text.includes(date)) show = false;
      if (category && !text.includes(category)) show = false;
      if (location && !text.includes(location)) show = false;
      card.style.display = show ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterEvents);
  if (dateInput) dateInput.addEventListener('change', filterEvents);
  if (categorySelect) categorySelect.addEventListener('change', filterEvents);
  if (locationInput) locationInput.addEventListener('input', filterEvents);

  // clearFilters: show all cards again
  window.clearFilters = function() {
    const cards = document.querySelectorAll('.Events .card');
    cards.forEach(c => c.style.display = '');
  };

  // Render related events dynamically into the .Events .row container
  function renderRelatedEvents(currentId, isEnglishPage) {
    try {
      const relatedRow = document.querySelector('.Events .row');
      if (!relatedRow) return;
      // clear current contents
      relatedRow.innerHTML = '';
      const dataset = isEnglishPage ? eventsData_en : eventsData;
      Object.keys(dataset).forEach(key => {
        if (key === currentId) return; // skip current
        const ev = dataset[key];
        const col = document.createElement('div');
        col.className = 'card m-2 col-6 p-1';
        col.style.width = '18rem';
        col.style.height = '33rem';

        const img = document.createElement('img');
        img.src = ev.img || '';
        img.className = 'card-img-top';
        img.alt = ev.title || '';

        const body = document.createElement('div');
        body.className = 'card-body';

        const h5 = document.createElement('h5');
        h5.className = 'card-title';
        h5.textContent = ev.title || '';

        const pLoc = document.createElement('p');
        pLoc.textContent = ev.location || '';

        const pVenue = document.createElement('p');
        pVenue.textContent = ev.venue || '';

        const pDesc = document.createElement('p');
        pDesc.className = 'card-text';
        pDesc.textContent = ev.desc ? (ev.desc.length > 120 ? ev.desc.substr(0, 117) + '...' : ev.desc) : '';

        const pDate = document.createElement('p');
        pDate.className = 'card-date';
        pDate.textContent = (isEnglishPage ? 'Date: ' : 'التاريخ: ') + (ev.date || '');

        const catBtn = document.createElement('a');
        catBtn.href = '#';
        catBtn.className = `border-2 w-25 p-2 m-1 rounded ${ev.class || ''}`;
        catBtn.textContent = ev.category || '';

        const detailsLink = document.createElement('a');
        detailsLink.href = (isEnglishPage ? 'event_en.html?id=' : 'event.html?id=') + ev.id;
        detailsLink.className = 'border-2 w-25 p-2 m-1 rounded custom-border';
        detailsLink.textContent = isEnglishPage ? 'Details' : 'التفاصيل';

        body.appendChild(h5);
        body.appendChild(pLoc);
        body.appendChild(pVenue);
        body.appendChild(pDesc);
        body.appendChild(pDate);
        body.appendChild(catBtn);
        body.appendChild(detailsLink);

        const card = document.createElement('div');
        card.className = 'card';
        card.appendChild(img);
        card.appendChild(body);

        col.appendChild(card);
        relatedRow.appendChild(col);
      });
    } catch (e) {
      console.warn('renderRelatedEvents failed', e);
    }
  }
})();

document.addEventListener('DOMContentLoaded', function() {
  const shareBtn = document.getElementById('shareBtn');
  const alertBox = document.getElementById('shareAlert');
  if (shareBtn) {

    function showAlert(message, type = 'success') {
      if (!alertBox) return;
      alertBox.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
    }

    shareBtn.addEventListener('click', async function () {
      const shareData = {
        title: document.title || 'Dalelk',
        text: (document.querySelector('h1') && document.querySelector('h1').innerText) || '',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          showAlert('تمت المشاركة بنجاح', 'success');
          return;
        } catch (err) {
        }
      }

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(shareData.url);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = shareData.url;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        showAlert('تم نسخ رابط الصفحة إلى الحافظة', 'success');
      } catch (err) {
        showAlert('تعذر مشاركة الرابط — الرجاء نسخه يدوياً: ' + shareData.url, 'danger');
      }
    });
  }
});

// Event detail 
(function(){
  const eventsData = {
    '1': {
      id: '1',
      title: 'حفل دار الاوبرا',
      date: '2025-11-05',
      category: 'موسيقى',
      venue: 'دار الأوبرا',
      location: 'دمشق',
      desc: 'انضموا إلينا في أمسية ساحرة من الفن والموسيقى في قلب العاصمة دمشق، حيث تحتضن دار الأوبرا حفلاً موسيقيًا مميزًا يجمع بين الأصالة والإبداع. استمتعوا بعروض موسيقية حية يقدمها نخبة من الفنانين السوريين والعالميين، وسط أجواء ثقافية راقية ومعمار تاريخي يأسر القلوب.',
      img: './assets/pexels-bertellifotografia-2608517.jpg',
      map: './assets/دار اوبرا دمشق خريطة .png',
      class:`music`,
      gallery: [
        './assets/pexels-bertellifotografia-2608517.jpg',
        './assets/pexels-jibarofoto-2774556.jpg',
        './assets/pexels-jibarofoto-2774556.jpg'
      ]
    },
    '2': {
      id: '2',
      title: 'عرض فلم The Lion King',
      date: '2025-10-10',
      category: 'عائلي',
      venue: ' شارع ابي العلاء المعري، حمص، سوريا,سينما حمص',
      location: ' ',
      desc: 'استعدوا لرحلة ساحرة إلى قلب السافانا الأفريقية مع الفيلم الأسطوري The Lion King! عيشوا لحظات الطفولة من جديد مع سيمبا، نالا، ومفاسا في قصة ملهمة عن الشجاعة، الحب، والعودة إلى الجذور. الآن لمشاهدة فلم الطفولة مع عائلتك',
      img: './assets/pexels-jibarofoto-2774556.jpg',
      map: './assets/سينما حمص خريطة.png',
      class:`family`,
      gallery: [
        './img/pexels-pixabay-257385.jpg',
         './img/the lion king.jpg',
        './img/the lion king 2.jpg'
      ]
    },
    '3': {
      id: '3',
      title: 'معرض الفن المعاصر',
      date: '2025-09-20',
      category: 'ثقافة',
      venue: 'مسرح اللاذقية القومي ,شارع هنانو ',
      location: 'اللاذقية',
      desc: 'في هذا المعرض، يلتقي الفنانون من مختلف أنحاء سوريا ليعرضوا أعمالهم التي تتنوع بين الواقعية والانطباعية، وبين التجريدية والسريالية، في تناغم فني يعبّر عن غنى الثقافة السورية وتنوعها. ستجد لوحات تحاكي الطبيعة الساحرة للاذقية، وأخرى تغوص في أعماق النفس البشرية، وثالثة تستلهم من التراث والتاريخ.',
      img: './assets/pexels-zhuhehuai-716276.jpg',
        class:`culture`,
      map: './assets/معرض اللاذقية خريطة.png',
      gallery: [
        './assets/pexels-zhuhehuai-716276.jpg',
        './img/معرض اللاذقية 1.jpg',
        './img/معرض اللاذقية 2.jpg',
      ]
    },
    '4': {
      id: '4',
      title: 'مباراة الاتحاد والكرامة',
      date: '2025-12-01',
      category: 'رياضة',
      venue: 'ستاد حلب الدولي',
      location: 'حلب',
      desc:'ّمباراة من العيار الثقيل في الدوري السوري الممتاز، يجمع بين ناديي الاتحاد الحلبي',
      img: './assets/dmitry-tomashek-pH7_hVJ65ss-unsplash.jpg',
      class:`sport`,
      map: './assets/خريطة ملغب حلب.png',
      gallery: [
        './img/ملعب حلب 1.png',
        './img/ملعب حلب 2.jpg',
        './img/ملعب حلب 3.jpg'
      ]
    }
  };

  const eventsData_en = {
    '1': {
      id: '1',
      title: 'Opera House Concert',
      date: '2025-11-05',
      category: 'Music',
      venue: 'Damascus Opera House',
      location: 'Damascus',
      desc: 'Join us for an enchanting evening of art and music in the heart of Damascus at the Opera House. Enjoy live performances by top Syrian and international artists in an elegant cultural setting.',
      img: './assets/pexels-bertellifotografia-2608517.jpg',
      map: './assets/دار اوبرا دمشق خريطة .png',
      class:`music`,
      gallery: [
        './assets/pexels-bertellifotografia-2608517.jpg',
        './assets/pexels-jibarofoto-2774556.jpg',
        './assets/pexels-jibarofoto-2774556.jpg'
      ]
    },
    '2': {
      id: '2',
      title: 'The Lion King (Film Screening)',
      date: '2025-10-10',
      category: 'Family',
      venue: 'Abi Alala Al-Maari Street, Homs — Cinema Homs',
      location: '',
      desc: 'Get ready for a magical journey into the heart of the African savanna with the legendary film The Lion King. Relive childhood moments with Simba, Nala and Mufasa.',
      img: './assets/pexels-jibarofoto-2774556.jpg',
      map: './assets/سينما حمص خريطة.png',
      class:`family`,
      gallery: [
        './img/pexels-pixabay-257385.jpg',
        './img/the lion king.jpg',
        './img/the lion king 2.jpg'
      ]
    },
    '3': {
      id: '3',
      title: 'Contemporary Art Exhibition',
      date: '2025-09-20',
      category: 'Culture',
      venue: 'Latakia National Theatre, Hanano Street',
      location: 'Latakia',
      desc: 'Artists from across Syria present works ranging from realism and impressionism to abstraction and surrealism — a celebration of Syria\'s rich cultural diversity.',
      img: './assets/pexels-zhuhehuai-716276.jpg',
      class:`culture`,
      map: './assets/معرض اللاذقية خريطة.png',
      gallery: [
        './assets/pexels-zhuhehuai-716276.jpg',
        './img/معرض اللاذقية 1.jpg',
        './img/معرض اللاذقية 2.jpg'
      ]
    },
    '4': {
      id: '4',
      title: 'Al Itihad vs Al Karama',
      date: '2025-12-01',
      category: 'Sport',
      venue: 'Aleppo International Stadium',
      location: 'Aleppo',
      desc: 'A heavyweight match in the Syrian Premier League between Al Itihad and Al Karama.',
      img: './assets/dmitry-tomashek-pH7_hVJ65ss-unsplash.jpg',
      class:`sport`,
      map: './assets/خريطة ملغب حلب.png',
      gallery: [
        './img/ملعب حلب 1.png',
        './img/ملعب حلب 2.jpg',
        './img/ملعب حلب 3.jpg'
      ]
    }
  };

  // simple query param parser
  function getQueryParam(name) {
    const qs = window.location.search;
    if (!qs) return null;
    const pairs = qs.substring(1).split('&');
    for (let i = 0; i < pairs.length; i++) {
      const parts = pairs[i].split('=');
      const key = decodeURIComponent(parts[0] || '');
      if (key === name) {
        return parts[1] ? decodeURIComponent(parts[1].replace(/\+/g, ' ')) : '';
      }
    }
    return null;
  }

  function populateEventPage(id) {
    // choose dataset based on page language (event_en.html uses English dataset)
    const isEnglishPage = window.location.pathname.includes('_en.html') || window.location.pathname.includes('/en');
    const data = (isEnglishPage && eventsData_en[id]) ? eventsData_en[id] : eventsData[id];
    if (!data) return;
    const titleEl = document.getElementById('eventTitle');
    const dateEl = document.getElementById('eventDate');
    const categoryEl = document.getElementById('eventCategory');
    const venueEl = document.getElementById('eventVenue');
    const locationEl = document.getElementById('eventLocation');
    const descEl = document.getElementById('eventDesc');
 
    const mapEl = document.getElementById('eventMap');

    if (titleEl) titleEl.textContent = data.title;
    if (dateEl) dateEl.textContent = data.date;
    if (categoryEl) categoryEl.textContent = data.category;
    if (venueEl) venueEl.textContent = data.venue;
    if (locationEl) locationEl.textContent = data.location;
    if (descEl) descEl.textContent = data.desc;
  
  if (mapEl ) mapEl.src = data.map;
    if(categoryEl)categoryEl.innerText = data.category;
    if(categoryEl)categoryEl.className = `border-2 w-25 p-2 m-1 rounded ${data.class} text-center`;

  
    try {
      const galleryRow = document.querySelector('.gallary .row');
      if (galleryRow) {
        galleryRow.innerHTML = '';
        if (Array.isArray(data.gallery) && data.gallery.length) {
          data.gallery.forEach(src => {
            const col = document.createElement('div');
            col.className = 'col';
            const card = document.createElement('div');
            card.className = 'card h-100';
            const img = document.createElement('img');
            img.className = 'card-img-top';
            img.src = src;
            img.alt = data.title || (isEnglishPage ? 'Event image' : 'صورة الفعالية');
            img.style.objectFit = 'cover';
            card.appendChild(img);
            col.appendChild(card);
            galleryRow.appendChild(col);
          });
        }
      }
    } catch (e) {
      
      console.warn('Gallery population failed', e);
    }

      // Remove the current event from the related events list (if present)
      try {
        const relatedCards = document.querySelectorAll('.Events .card');
        relatedCards.forEach(card => {
          const link = card.querySelector('a[href*="event.html?id="], a[href*="event_en.html?id="]');
          if (!link) return;
       
          try {
            const url = new URL(link.getAttribute('href'), window.location.href);
            const linkId = url.searchParams.get('id');
            if (linkId === id) card.style.display="none";
          } catch (err) {
            // Fallback: simple regex parse
            const m = (link.getAttribute('href') || '').match(/id=(\d+)/);
            if (m && m[1] === id) card.style.display="none";
          }
        });
      } catch (e) {
        console.warn('Related list pruning failed', e);
      }

  }

  document.addEventListener('DOMContentLoaded', function() {
    const id = getQueryParam('id');
    if (id) populateEventPage(id);
  });
})();
(function(){
  const contactFormEl = document.getElementById('contactForm');
  if (!contactFormEl) return;
  const isEnglishPage = window.location.pathname.includes('_en.html') || window.location.pathname.includes('/en');
  contactFormEl.addEventListener('submit', function(e) {
    e.preventDefault();
    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var message = document.getElementById('message').value.trim();
    var alertBox = document.getElementById('alertBox');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !message) {
      alertBox.innerHTML = '<div class="alert alert-danger">' + (isEnglishPage ? 'All fields are required.' : 'جميع الحقول مطلوبة.') + '</div>';
      return;
    }
    if (!emailPattern.test(email)) {
      alertBox.innerHTML = '<div class="alert alert-danger">' + (isEnglishPage ? 'Invalid email format.' : 'صيغة البريد الإلكتروني غير صحيحة.') + '</div>';
      return;
    }
    alertBox.innerHTML = '<div class="alert alert-success">' + (isEnglishPage ? 'Your message has been sent successfully! We will reply soon.' : 'تم إرسال رسالتك بنجاح! سنقوم بالرد قريباً.') + '</div>';
    this.reset();
  });
})();

