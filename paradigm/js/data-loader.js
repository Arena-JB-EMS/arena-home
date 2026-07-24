/* ============================================================
   File:    data-loader.js
   Project: The Arena Hub Paradigm
   Version: 1.0.0
   Sync:    2026-07-24
   Owner:   The Arena Hub Ltd · Jonathan Baguley
   ============================================================
   Single fetch abstraction for every content type Paradigm renders.
   Every page calls ParadigmData.getX() and gets back the same JSON
   shape whether the source is a local mock fixture or the live GAS
   Web App — this is the swap point referenced throughout
   ARENA_PARADIGM_ARCHITECTURAL_REVIEW.md (Stage 2 Issue 4, Stage 5.4).

   TO GO LIVE (Phase 4 of the build plan):
     1. Set CONFIG.paradigm.source  = 'live'
        CONFIG.paradigm.url         = '<PARADIGM_DATA.gs /exec URL>'
     2. Set CONFIG.compliance.source = 'live'
        (CONFIG.compliance.url is already the real, deployed
        COMPLIANCE_REGISTRY.gs endpoint — no new deployment needed,
        it just needs the PARADIGM/OBSERVATORY PRODUCT_ID rows and
        TOPIC_TAGS column adding per Stage 5.2 before this flips).
     No other file changes required — every page already calls
     these functions, not a URL directly.
   ============================================================ */

window.ParadigmData = (function () {

  var CONFIG = {
    paradigm: {
      source: 'live',                  // 'mock' | 'live' — LIVE since 2026-07-24 (S143), verified via real PAPERS fetch
      url: 'https://script.google.com/macros/s/AKfycbwMqWiPWYBvemshAKmaHHBLKoHPx2mI6I3ftICW99un0kDzC29MlAldG3MfqtKar8Ytlg/exec'
    },
    compliance: {
      source: 'live',                 // 'mock' | 'live' — LIVE since 2026-07-24 (S143): 5 real, sourced PARADIGM/OBSERVATORY regulation rows seeded and confirmed
      // Real, already-deployed Compliance Registry endpoint (S137, v2.1.0 as of S143).
      // Stays pointed here for the eventual live switch — no new
      // Web App needed for this half of the data (Stage 3 Q2).
      url: 'https://script.google.com/macros/s/AKfycbzKIxvEFG8QzgWI3TAR9xltV1UAGOgslk8jdzXiGXl-cwWhJOrPOD6tCFMKAVcqYLqe/exec'
    }
  };

  var cache = {};

  function base() {
    return (window.PARADIGM_PAGE && window.PARADIGM_PAGE.base) || '';
  }

  function mockFetch(file) {
    var key = 'mock:' + file;
    if (cache[key]) return cache[key];
    cache[key] = fetch(base() + 'data/mock/' + file)
      .then(function (r) { if (!r.ok) throw new Error('Mock fixture missing: ' + file); return r.json(); });
    return cache[key];
  }

  function paradigmFetch(tab, mockFile) {
    if (CONFIG.paradigm.source === 'live' && CONFIG.paradigm.url) {
      var key = 'live-paradigm:' + tab;
      if (cache[key]) return cache[key];
      cache[key] = fetch(CONFIG.paradigm.url + '?tab=' + encodeURIComponent(tab))
        .then(function (r) { return r.json(); })
        .then(function (payload) {
          if (!payload || payload.success === false) throw new Error((payload && payload.error) || 'PARADIGM_DATA fetch failed');
          return payload.rows || payload;
        });
      return cache[key];
    }
    return mockFetch(mockFile);
  }

  function complianceFetch(product) {
    if (CONFIG.compliance.source === 'live') {
      var key = 'live-compliance:' + product;
      if (cache[key]) return cache[key];
      cache[key] = fetch(CONFIG.compliance.url + '?product=' + encodeURIComponent(product))
        .then(function (r) { return r.json(); })
        .then(function (payload) {
          if (!payload || payload.success === false) throw new Error((payload && payload.error) || 'Compliance Registry fetch failed');
          return payload;
        });
      return cache[key];
    }
    return mockFetch('regulations_paradigm.json');
  }

  return {
    CONFIG: CONFIG, // exposed for the Phase-4 live switch

    getTopics:        function () { return paradigmFetch('TOPICS', 'topics.json'); },
    getKnowledgeLinks: function () { return paradigmFetch('KNOWLEDGE_LINKS', 'knowledge_links.json'); },
    getPapers:        function () { return paradigmFetch('PAPERS', 'papers.json'); },
    getQuestions:     function () { return paradigmFetch('QUESTIONS', 'questions.json'); },
    getConversations: function () { return paradigmFetch('CONVERSATIONS', 'conversations.json'); },

    /** product: 'PARADIGM' | 'OBSERVATORY' — returns { sections, regulations, lastUpdated } */
    getRegulations: function (product) { return complianceFetch(product || 'PARADIGM'); },

    /**
     * Explore a Question — fixed response contract (Stage 2 Issue 4).
     * Currently a client-side matcher over the mock/live datasets already
     * loaded; the shape below is exactly what a future RAG/AI endpoint
     * must return so this function's internals can be swapped without
     * touching any page that calls it.
     */
    exploreQuestion: function (queryText) {
      var q = (queryText || '').toLowerCase();
      return Promise.all([this.getPapers(), this.getQuestions(), this.getRegulations('PARADIGM')])
        .then(function (results) {
          var papers = results[0] || [];
          var questions = results[1] || [];
          var regs = (results[2] && results[2].regulations) || [];

          function matches(text) { return text && text.toLowerCase().indexOf(q) !== -1; }
          function scoreTags(tagsField) {
            if (!q) return false;
            var tags = (tagsField || '').toLowerCase();
            return q.split(' ').some(function (w) { return w.length > 3 && tags.indexOf(w) !== -1; });
          }

          var relatedPapers = papers.filter(function (p) {
            return matches(p.TITLE) || matches(p.SHORT_DESCRIPTION) || scoreTags(p.TAGS);
          }).slice(0, 5);

          var relatedQuestions = questions.filter(function (item) {
            return matches(item.QUESTION_TEXT) || scoreTags(item.TAGS);
          }).slice(0, 5);

          var officialSources = regs.filter(function (r) {
            return matches(r.title) || matches(r.summary) || scoreTags((r.tags || []).join(','));
          }).slice(0, 5);

          return {
            query: queryText,
            official_sources:   officialSources,
            arena_commentary:   officialSources.map(function (r) { return { regId: r.id, text: r.arenaCompliance }; }).filter(function (c) { return c.text; }),
            related_papers:     relatedPapers,
            related_questions:  relatedQuestions,
            discussion:         [],   // Forum inert in V1 — always empty, see forum-inert.js
            further_reading:    relatedPapers.slice(0, 3)
          };
        });
    }
  };
})();
