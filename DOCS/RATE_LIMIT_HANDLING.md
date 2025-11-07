# Rate Limit (429) Error Handling

## 🔍 Understanding 429 Errors

**Status Code**: `429 Too Many Requests`

**Meaning**: Your API key is **VALID** but you've exceeded the rate limit/quota for the Gemini API.

### Common Causes:
1. **Too many requests in a short time** - API has per-minute/per-hour limits
2. **Free tier quota exceeded** - Free API keys have daily/monthly limits
3. **Rapid successive requests** - Making requests too quickly

## ✅ Solutions Implemented

### 1. **Automatic Retry with Backoff**
- When a 429 error is detected, the system waits before retrying
- Uses `Retry-After` header if available, otherwise waits 60 seconds
- Automatically retries the same endpoint

### 2. **Better Error Messages**
- Clear error messages explaining rate limit issues
- User-friendly feedback instead of technical errors
- Logs show exactly what happened

### 3. **Rate Limit Detection**
- Detects 429 errors specifically
- Provides actionable feedback
- Suggests waiting before retrying

## 🛠️ How It Works

### In `geminiService.ts`:

```typescript
if (response.status === 429) {
  // Rate limit exceeded - wait and retry
  const retryAfter = response.headers.get('Retry-After') || '60';
  const waitTime = parseInt(retryAfter) * 1000;
  console.warn(`⚠️ Rate limit exceeded (429). Waiting ${waitTime/1000}s...`);
  await new Promise(resolve => setTimeout(resolve, waitTime));
  // Retry the same endpoint
  i--;
  continue;
}
```

### Error Handling:

```typescript
if (response.status === 429) {
  throw new Error(`Rate limit exceeded: ${errorMessage}`);
}
```

## 📊 Rate Limit Information

### Free Tier Limits (Typical):
- **Requests per minute**: 15-60 requests
- **Requests per day**: 1,500 requests
- **Tokens per minute**: Varies by model

### Paid Tier Limits:
- Higher limits based on your plan
- Check Google Cloud Console for your specific quotas

## 🔧 How to Check Your Quota

1. **Google Cloud Console**:
   - Go to: https://console.cloud.google.com/
   - Navigate to: APIs & Services → Quotas
   - Search for "Generative Language API"
   - Check your current usage

2. **API Response Headers**:
   - `X-RateLimit-Limit`: Maximum requests allowed
   - `X-RateLimit-Remaining`: Requests remaining
   - `Retry-After`: Seconds to wait before retrying

## 💡 Best Practices

### 1. **Implement Request Throttling**
- Add delays between requests
- Batch requests when possible
- Cache responses when appropriate

### 2. **Monitor Rate Limits**
- Track your API usage
- Set up alerts for quota warnings
- Implement exponential backoff

### 3. **Handle Errors Gracefully**
- Show user-friendly messages
- Provide retry options
- Log errors for debugging

## 🚨 If You Keep Getting 429 Errors

1. **Wait**: The simplest solution - wait a few minutes
2. **Check Quota**: Verify you haven't exceeded daily limits
3. **Upgrade Plan**: Consider upgrading to paid tier
4. **Reduce Requests**: Implement caching or reduce request frequency
5. **Contact Support**: If issues persist, contact Google Cloud Support

## 📝 Example Error Message

```
[GeminiService] ❌ RATE LIMIT EXCEEDED (429)
[GeminiService] Error: Resource has been exhausted (e.g. check quota).
[GeminiService] Please wait before making more requests.
```

## ✅ Current Implementation Status

- ✅ 429 error detection
- ✅ Automatic retry with backoff
- ✅ User-friendly error messages
- ✅ Logging for debugging
- ✅ Retry-After header support

---

**Note**: The API key is **VALID**. The 429 error means you need to wait or upgrade your quota.

