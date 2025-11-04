/**
 * Sanity GROQ Queries
 *
 * GROQ queries for fetching data from Sanity CMS. These are used by
 * `useServices()` and `usePortfolio()` hooks across the app.
 */

export const Q_SERVICES = `*[_type=="service"]|order(priority asc){_id, title, description, image, priority, filters, hoverId}`;

export const Q_PORTFOLIO = `*[_type=="portfolioItem"]|order(priority asc){_id, title, description, image, link, category, priority, categorySlugs, hoverId}`;

export const Q_SERVICE_BY_SLUG = `*[_type=="service" && slug.current==$slug][0]{_id, title, slug, description, image, priority, filters, hoverId, seo}`;
export const Q_PORTFOLIO_BY_SLUG = `*[_type=="portfolioItem" && slug.current==$slug][0]{_id, title, slug, description, image, link, category, priority, categorySlugs, hoverId, seo}`;
export const Q_PORTFOLIO_BY_CATEGORY = `*[_type=="portfolioItem" && category==$category]|order(priority asc){_id, title, slug, description, image, link, category, priority, categorySlugs, hoverId}`;

export const Q_SEARCH = `*[_type in ["service", "portfolioItem"] && (title match $searchTerm || description match $searchTerm)]|order(priority asc){_id, _type, title, slug, description, image, priority}`;

export const Q_PORTFOLIO_CATEGORIES = `array::unique(*[_type=="portfolioItem"].category)`;
export const Q_FEATURED_PORTFOLIO = `*[_type=="portfolioItem" && priority <= 3]|order(priority asc){_id, title, slug, description, image, link, category, priority}`;
