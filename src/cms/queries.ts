export const Q_SERVICES = `*[_type=="service"]|order(priority asc){
  _id, title, description, image, priority, filters, hoverId
}`;

export const Q_PORTFOLIO = `*[_type=="portfolioItem"]|order(priority asc){
  _id, title, description, image, link, category, priority, categorySlugs, hoverId
}`;
