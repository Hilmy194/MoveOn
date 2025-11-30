# AI MEAL PLANNER ANALYSIS - MOVEON FITNESS PLATFORM

## USER STORY

As a trainee in the MoveOn fitness platform, I want to receive personalized AI-generated meal plans based on my fitness goals, dietary preferences, and restrictions, so that I can maintain proper nutrition aligned with my workout routine.

**Sample Inputs:**
- Daily calories: 2000 kcal
- Diet type: Balanced, Low-Carb, High-Protein, Vegetarian, Vegan
- Allergies: nuts, dairy, gluten
- Goal: Weight Loss, Muscle Gain, Maintenance

---

## STATION 1: DATA AND ETL PIPELINES

**What data does your feature need?**
- User preferences: calories, diet type, allergies, fitness goal
- Output: 3 meals with name, macros, ingredients, instructions

**How clean/structured is it?**
- Highly structured from validated React form inputs
- JSON output format with predefined schema
- Fallback templates pre-cleaned and ready
- Data flow: Input → Validation → Prompt → API → JSON → Display

---

## STATION 2: EMBEDDINGS AND VECTOR STORES

**Does your feature need knowledge retrieval?**
- No, not currently implemented
- Feature is generative, not retrieval-based
- Gemini has sufficient nutrition knowledge built-in

**What goes into your vector database?**
- Nothing currently
- Future: user meal history, recipe database, personalized preferences

---

## STATION 3: LLM APIS AND PROMPT ENGINEERING

**What is your system prompt?**
- Create daily meal plan in JSON with 3 meals
- Match calorie target and diet type
- Avoid specified allergens
- Include macros, ingredients, cooking instructions
- Output pure JSON without markdown

**Where does the LLM fit?**
- Frontend → geminiService.js → Google Gemini 2.0 Flash API → JSON response → Display
- Model: gemini-2.0-flash-exp
- Temperature: 0.7, Max tokens: 2048

---

## STATION 4: FINE-TUNING AND CUSTOM MODELS

**Do you need customization beyond prompting?**
- No, using zero-shot prompting only
- Base Gemini model has sufficient nutrition knowledge

**Do you have the data?**
- No training data collected yet
- Future: fine-tune on user feedback and regional cuisine preferences

---

## STATION 5: RAG

**Should your system use retrieved knowledge?**
- No RAG currently implemented
- Stateless generation is sufficient
- Base model knowledge covers general nutrition

**What documents will you store?**
- Nothing currently
- Future: recipe database, user history, dietary guidelines, regional foods

---

## STATION 6: TOOL AND FUNCTION CALLING

**Does your feature need structured actions?**
- No, simple request-response pattern only
- No function calls or tools

**Which tools would you define?**
- Future tools: calculate_macros, validate_allergies, get_user_preferences, save_meal_plan, search_recipes

---

## STATION 7: APPLICATION INTEGRATION

**What talks to what?**
- React Frontend (AIAssistant.jsx) → geminiService.js → Google Gemini API → Response parsing → UI display
- Direct frontend-to-API integration, no backend proxy
- API key in environment variable (VITE_GEMINI_API_KEY)

**Where is the AI service hosted?**
- External: Google Cloud Platform
- Not self-hosted, using managed API service

---

## STATION 8: EVALUATION AND MONITORING

**How will you measure success?**
- Currently: basic error handling and fallback only
- Missing: response time tracking, API success rate, user ratings, accuracy validation

**What does good look like?**
- Response time under 5 seconds
- API success rate above 99%
- Valid JSON output 100%
- User satisfaction above 4.0/5.0
- Calorie accuracy within 10% of target
- Zero allergen violations

---

## STATION 9: RESPONSIBLE AI AND GUARDRAILS

**What risks exist?**
- Allergen inclusion despite restrictions
- Nutritional misinformation
- AI hallucinations
- API key exposure (client-side)
- Dietary/religious violations

**What guardrails do you need?**

Currently implemented:
- Fallback system with local templates
- Explicit allergy instructions in prompts
- JSON schema validation
- Error handling with user messages

Critical gaps:
- Allergen cross-checking validation
- Nutritional boundary checks
- Input sanitization
- Rate limiting
- Audit logging
- Backend proxy to hide API key

---

## THREE KEY TECHNICAL DECISIONS

**Decision 1: Google Gemini API vs OpenAI**
- Chose Gemini for lower cost and faster speed
- Trade-off: Less mature ecosystem but better value

**Decision 2: Direct Frontend-to-API (No Backend)**
- Chose for simpler architecture and faster development
- Trade-off: Security risk with exposed API key, no rate limiting
- Recommendation: migrate to backend proxy for production

**Decision 3: Local Fallback System**
- Chose template-based fallbacks for 100% availability
- Trade-off: Less personalized but guaranteed uptime

---

## RESPONSIBLE AI PARAGRAPH

Our AI Meal Planner prioritizes user safety through multiple layers of protection. Primary risks include allergen violations, nutritional misinformation, and AI hallucinations. We currently implement basic guardrails with explicit prompting, JSON validation, and fallback templates. Critical improvements needed include allergen cross-checking, nutritional boundary validation, audit logging, and migrating API calls to a backend proxy to secure the API key. We must also add rate limiting, user feedback collection, and content filtering. These guardrails ensure our AI is safe, ethical, and trustworthy for users depending on it for their health and fitness nutrition.

---

## REFLECTION

The most important AI building block I need to understand better is Evaluation and Monitoring because without systematic metrics we cannot verify if our AI helps or harms users through incorrect nutrition advice. We need real-time monitoring, user feedback loops, and automated validation to ensure production safety and effectiveness.

---

## SYSTEM ARCHITECTURE DIAGRAM

```
User (Trainee)
    |
    | Input: Calories, Diet, Allergies, Goal
    |
    v
React Frontend (AIAssistant.jsx)
    |
    | Form validation & state management
    |
    v
geminiService.js
    |
    | - Build prompt template
    | - API key from environment
    | - Error handling
    |
    v
Google Gemini API (External)
    |
    | Model: gemini-2.0-flash-exp
    | Generate JSON meal plan
    |
    v
Response Processing
    |
    | - Parse JSON
    | - Validate schema
    | - Check for errors
    |
    v
Success? ----No----> Local Fallback (Templates)
    |                        |
    Yes                      |
    |                        |
    v                        v
Display Meal Plan to User
    |
    | - 3 meal cards
    | - Nutrition info
    | - Cooking instructions
```

---

## SUMMARY TABLE

| AI Building Block | Status | Implementation Details |
|-------------------|--------|------------------------|
| Data & ETL | Implemented | Clean structured inputs, JSON output validation |
| Embeddings | Not Used | Not needed for generative task |
| Vector Stores | Not Used | No retrieval component |
| LLM API | Implemented | Google Gemini 2.0 Flash via REST API |
| Prompt Engineering | Implemented | Structured prompt with clear instructions |
| Fine-tuning | Not Used | Zero-shot prompting sufficient |
| RAG | Not Used | No knowledge retrieval needed |
| Tool/Function Calling | Not Used | Simple request-response pattern |
| Application Integration | Implemented | Direct frontend-to-API, React UI |
| Evaluation | Partial | Basic error handling, no metrics |
| Monitoring | Not Implemented | No logging, analytics, or dashboards |
| Guardrails | Basic | Prompt-based only, needs validation layer |

---

## RECOMMENDATIONS FOR IMPROVEMENT

**High Priority (Security & Safety):**
1. Move API calls to backend - Hide API key from client
2. Implement allergen validation - Cross-check ingredients against restrictions
3. Add nutritional boundary checks - Validate macro calculations

**Medium Priority (Reliability):**
4. Add monitoring & logging - Track API performance and failures
5. Implement rate limiting - Prevent abuse and control costs
6. Create user feedback system - Collect satisfaction ratings

**Low Priority (Enhancement):**
7. Consider RAG - Add recipe database for variety
8. Explore fine-tuning - Personalize to user preferences
9. Add caching - Store common meal plans
