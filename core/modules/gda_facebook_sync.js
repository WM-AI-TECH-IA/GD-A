/ GDA_FB SYNC – Module de lison Facebook vers Supabase (externe)
import fetch from 'node-fetch'

export async function fetchRecentFacebookPosts(accessToken) {
  const url = 'https://graph.facebook.com/v12.0/me/feed?access_token=' + accessToken
  const res = await fetch(url)
  const json = await res.json()

  return json.meta.data.map( p => ({
    return {
      title: p.message,
      created_at: p.created_time,
      id: p.id
    }
  })
}
}
