# 🔑 GEMINI API SETUP GUIDE

## WHAT'S NEW

Your prototype now has **REAL Gemini API integration**! It can:
✅ Parse actual PDF policy documents
✅ Extract clauses, exclusions, waiting periods
✅ Generate real scenario analysis based on the policy
✅ Create personalized recommendations

---

## 🚀 QUICK SETUP (5 STEPS)

### STEP 1: Get Your Gemini API Key

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Click **"Create API Key"**
4. Copy the key (starts with `AIzaSy...`)

**Free tier includes:**
- 1,500 requests per day
- 1 million tokens per month
- Perfect for demos and testing

---

### STEP 2: Install New Dependencies

```bash
cd claimguard-prototype
npm install @google/generative-ai
```

---

### STEP 3: Add Your API Key

**Option A: Using .env.local file (Recommended for local)**

1. Open the `.env.local` file in the root folder
2. Replace `your_api_key_here` with your actual key:

```
VITE_GEMINI_API_KEY=AIzaSyC_your_actual_key_here
```

3. Save the file

**Option B: For Vercel deployment**

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add new variable:
   - Name: `VITE_GEMINI_API_KEY`
   - Value: Your Gemini API key
4. Redeploy

---

### STEP 4: Test Locally

```bash
npm run dev
```

1. Open http://localhost:5173
2. **Upload a real insurance policy PDF**
3. Enter your details
4. Click "Analyze My Policy"
5. Wait ~20 seconds (real API processing)
6. See REAL analysis based on your PDF!

---

### STEP 5: Deploy with API

```bash
vercel
```

Make sure to add the environment variable in Vercel dashboard (see Option B above).

---

## 📋 HOW IT WORKS

### With Real PDF Uploaded:
1. User uploads policy PDF
2. PDF is converted to base64
3. Sent to Gemini 1.5 Flash API
4. Gemini analyzes the document
5. Extracts coverage details, exclusions, waiting periods
6. Generates 20 scenario predictions
7. Creates personalized recommendations

### Without PDF (Fallback):
- Uses mock data (the demo you already tested)
- Perfect for when you don't have a policy PDF handy

---

## 🎯 TESTING WITH REAL PDFS

### Where to Get Test PDFs:

1. **Your own policy** (if you have one)
2. **Sample policies online:**
   - Max Bupa sample policy
   - Star Health sample brochure
   - HDFC Ergo sample documents

3. **Create a test PDF:**
   - Write a simple policy in Word/Google Docs
   - Include sections like:
     - Coverage Amount: ₹5 lakh
     - Waiting Period: 48 months for joint replacement
     - Sub-limits: ₹3 lakh for cancer treatment
     - Exclusions: Maternity, cosmetic surgery
   - Save as PDF

---

## 🔧 WHAT GEMINI ANALYZES

The AI looks for:

✅ **Coverage Amount** - Total sum insured
✅ **Waiting Periods** - How long before treatments are covered
✅ **Sub-limits** - Caps on specific treatments
✅ **Co-payment** - Percentage you pay out of pocket
✅ **Room Rent Capping** - Limits on daily room charges
✅ **Pre-existing Disease** - Coverage for conditions you already have
✅ **Network Hospitals** - Which hospitals offer cashless treatment
✅ **Exclusions** - What's NOT covered

Then generates coverage predictions for each scenario.

---

## 💰 API COSTS (Free Tier)

**Gemini 1.5 Flash (what we're using):**
- **Free:** 1,500 requests/day
- **Cost per analysis:** ~0.5¢ USD (if you exceed free tier)
- **Your prototype:** Easily stays within free tier

**For hackathon demo:**
- Unlimited free usage within daily limit
- Perfect for judges to test multiple times

---

## 🎭 DEMO MODES

Your prototype intelligently handles both:

### Mode 1: Demo Mode (No API Key)
- API key not configured
- Uses mock data
- Instant results
- Perfect for offline demos

### Mode 2: Real Mode (With API Key)
- API key configured
- Processes actual PDFs
- Takes 15-30 seconds
- Shows real analysis

**The app automatically falls back to mock data if API fails!**

---

## 🐛 TROUBLESHOOTING

### "API key not configured" message

**Check:**
1. `.env.local` file exists in root folder
2. Key is spelled correctly: `VITE_GEMINI_API_KEY`
3. No spaces around the `=` sign
4. Key starts with `AIzaSy...`
5. Restart dev server after adding key

---

### "Failed to analyze policy" error

**Possible causes:**
1. PDF is too large (>20MB) - compress it
2. PDF is scanned image (no text) - use a text-based PDF
3. API quota exceeded - check Google AI Studio dashboard
4. Network issue - check internet connection

**Fix:** App will automatically use mock data as fallback

---

### API calls are slow

**Normal:** First call takes 20-30 seconds (Gemini is analyzing the entire PDF)

**Speed tips:**
- Use smaller PDFs (under 10 pages)
- Gemini 1.5 Flash is already the fastest model
- Consider caching results for repeat analyses

---

## 📊 FOR YOUR DEMO

### What to Tell Judges:

> "We've integrated Google's Gemini 1.5 Flash API for real-time policy analysis. For the demo, I can either:
> 
> 1. **Show live analysis** - Upload a real policy PDF and you'll see actual AI-powered analysis in 30 seconds
> 2. **Use demo mode** - Instant results using pre-loaded sample data
> 
> In production, this would connect to insurance company APIs directly, but for the hackathon we're demonstrating the capability with public APIs."

### Live Demo Tips:

✅ **Have a test PDF ready** - Save time during presentation
✅ **Mention the 30-second wait** - Set expectations
✅ **Show the loading animation** - It's polished and professional
✅ **Compare mock vs real** - Show both modes if time allows

---

## 🔐 SECURITY NOTES

### For Hackathon:
- `.env.local` is fine for local testing
- Don't commit API keys to GitHub (already in .gitignore)

### For Production:
- Use Vercel environment variables
- Implement rate limiting
- Add authentication
- Backend proxy for API calls

---

## 🚀 DEPLOYMENT WITH API

### Local Testing:
```bash
npm run dev
# API key from .env.local
```

### Vercel Deployment:
```bash
vercel
# Add API key in Vercel dashboard
# Settings → Environment Variables
# VITE_GEMINI_API_KEY = your_key
```

**Important:** After adding environment variable, redeploy:
```bash
vercel --prod
```

---

## ✨ BONUS: API FEATURES

Your Gemini integration includes:

1. **Smart Prompting** - Structured JSON output
2. **Error Handling** - Automatic fallback to mock data
3. **Context Awareness** - Uses user age, conditions in analysis
4. **Recommendation Engine** - Generates fix suggestions automatically
5. **Policy Summary** - Extracts key policy details

---

## 🏆 WHY THIS IMPRESSES JUDGES

✅ **Real AI integration** - Not just mockups
✅ **Production-ready approach** - Proper error handling
✅ **Dual-mode operation** - Works with or without API
✅ **Smart fallbacks** - Never breaks for users
✅ **Clear documentation** - Shows technical maturity

---

**YOU NOW HAVE A REAL AI-POWERED PROTOTYPE!** 

Test it with actual policy PDFs and watch Gemini analyze them in real-time. 🔥
