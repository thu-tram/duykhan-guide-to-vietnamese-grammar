// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="starter-guide.html"><strong aria-hidden="true">1.</strong> README</a></li><li class="chapter-item expanded "><a href="nouns.html"><strong aria-hidden="true">2.</strong> Nouns</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="unit_nouns.html"><strong aria-hidden="true">2.1.</strong> Unit nouns</a></li></ol></li><li class="chapter-item expanded "><a href="verbs.html"><strong aria-hidden="true">3.</strong> Verbs</a></li><li class="chapter-item expanded "><a href="adjectives.html"><strong aria-hidden="true">4.</strong> Adjectives</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="types_of_adjectives.html"><strong aria-hidden="true">4.1.</strong> Types of Adjectives</a></li></ol></li><li class="chapter-item expanded "><a href="sentence_structure.html"><strong aria-hidden="true">5.</strong> Sentences</a></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">5.1.</strong> Types of Sentences</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="simple_sentences.html"><strong aria-hidden="true">5.1.1.</strong> Simple Sentences</a></li><li class="chapter-item expanded "><a href="compound_sentences.html"><strong aria-hidden="true">5.1.2.</strong> Compound Sentences</a></li><li class="chapter-item expanded "><a href="complex_sentences.html"><strong aria-hidden="true">5.1.3.</strong> Complex Sentences</a></li></ol></li><li class="chapter-item expanded "><a href="passive_voice.html"><strong aria-hidden="true">5.2.</strong> Passive Voice</a></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">6.</strong> Problem words, phrases and constructions</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="to_be.html"><strong aria-hidden="true">6.1.</strong> To be</a></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">7.</strong> Word Types</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="prepositions.html"><strong aria-hidden="true">7.1.</strong> Prepositions</a></li><li class="chapter-item expanded "><a href="pronouns.html"><strong aria-hidden="true">7.2.</strong> Pronouns</a></li><li class="chapter-item expanded "><a href="modals_and_auxiliary_verbs.html"><strong aria-hidden="true">7.3.</strong> Modals and Auxiliary Verbs</a></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.</strong> Other</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="plural.html"><strong aria-hidden="true">8.1.</strong> Plural</a></li><li class="chapter-item expanded "><a href="compound_words.html"><strong aria-hidden="true">8.2.</strong> Compound words</a></li><li class="chapter-item expanded "><a href="conjunctions_and_negations.html"><strong aria-hidden="true">8.3.</strong> Conjunctions and negations</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
