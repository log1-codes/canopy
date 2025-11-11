export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7; 
  
    if (diffInSeconds < minute) {
      return 'just now';
    } else if (diffInSeconds < hour) {
      const minutes = Math.floor(diffInSeconds / minute);
      return `${minutes} min ago`;
    } else if (diffInSeconds < day) {
      const hours = Math.floor(diffInSeconds / hour);
      return `${hours} hr ago`;
    } else if (diffInSeconds < week) {
      const days = Math.floor(diffInSeconds / day);
      return `${days} days ago`;
    } else {
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, 
      };
      const formattedDate = date.toLocaleDateString('en-US', options);
      
      return formattedDate
          .replace(/,/, '')
          .replace(/\s(a\.m\.|p\.m\.)/i, (match) => match.toUpperCase().replace(/\./g, '')); // Standardize AM/PM
    }
  }