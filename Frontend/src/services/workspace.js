const API_URL = 'http://localhost:8000';

export async function createWorkSpace(work) {
  try {
    const response = await fetch(`${API_URL}/workspaces/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(work),
      credentials: 'include',
    });
    const result = await response.json();
    console.log(result);
    if (!response.ok) {
      let workMsg = 'The workspace failed';
      if (Array.isArray(result.detail)) {
        workMsg = result.detail[0].msg;
      } else if (typeof result.detail === 'string') {
        workMsg = result.detail;
      }
      throw new Error(workMsg);
    }
    return result;
  } catch (error) {
    console.log('The error is ', error);
    throw error;
  }
}

export async function getWorkSpace() {
  try {
    const response = await fetch(`${API_URL}/workspaces/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.status === 401) {
      return [];
    }
    const data = await response.json();
    if (!response.ok) {
      throw new Error('Failed to load workspaces');
    }
    return Array.isArray(data) ? data : (data ? [data] : []);
  } catch (err) {
    console.log('Workspace fetch error:', err);
    throw err;
  }
}
