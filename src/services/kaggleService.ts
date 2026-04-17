export interface KaggleDatasetMeta {
  slug: string;
  files: { name: string; size: string; rows: number }[];
  suggestedFile: string;
  schema: { name: string; type: string }[];
  contentHash: string;
}

class KaggleService {
  async introspect(url: string): Promise<KaggleDatasetMeta> {
    const response = await fetch('/api/kaggle/introspect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to introspect Kaggle URL');
    }

    return response.json();
  }

  async startDownload(slug: string, fileName: string) {
    const response = await fetch('/api/kaggle/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, fileName })
    });

    if (!response.ok) {
      throw new Error('Download failed to initialize');
    }

    return response.json();
  }
}

export const kaggleService = new KaggleService();
