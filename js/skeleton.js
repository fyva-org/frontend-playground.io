// Simulate loading delay (e.g., API call)
setTimeout(() => {
    // Hide skeleton
    document.querySelector('.skeleton-loader').style.display = 'none';
    
    // Show content with fade-in effect
    const content = document.querySelector('.content');
    content.style.display = 'block';
    setTimeout(() => content.classList.add('show'), 10);
  }, 2000); // Simulate 2-second delay