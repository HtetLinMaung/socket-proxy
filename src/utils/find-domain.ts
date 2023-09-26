import { domainMap } from "../constants";

export default function findDomain(url: string) {
  const urlWithoutQuery = url.split("?")[0];
  if (urlWithoutQuery in domainMap) {
    return domainMap[urlWithoutQuery];
  } else {
    const domains = Object.keys(domainMap);
    for (const domain of domains) {
      if (domain.startsWith(urlWithoutQuery)) {
        return domain;
      }
    }
    return "http://localhost:3000";
  }
}
