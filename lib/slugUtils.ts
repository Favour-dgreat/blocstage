// Utility function to create URL-friendly slugs from event titles
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Function to extract event ID from slug-based URL
export function extractEventIdFromSlug(slug: string): string {
  // Extract the event ID from the end of the slug (format: event-title--eventId)
  // Use double dash as separator to avoid conflicts with hyphens in titles
  
  const doubleDashIndex = slug.lastIndexOf('--');
  if (doubleDashIndex !== -1) {
    return slug.substring(doubleDashIndex + 2);
  }
  
  // Fallback: if no double dash found, return the original slug
  // This handles cases where someone might access the old format
  return slug;
}

// Function to find event by title slug
export async function findEventByTitleSlug(titleSlug: string): Promise<{ id: string; title: string } | null> {
  try {
    const response = await fetch('https://api.blocstage.com/events');
    if (!response.ok) return null;
    
    const events = await response.json();
    const matchingEvent = events.find((event: any) => 
      createSlug(event.title) === titleSlug
    );
    
    return matchingEvent ? { id: matchingEvent.id, title: matchingEvent.title } : null;
  } catch (error) {
    console.error('Error finding event by title slug:', error);
    return null;
  }
}
