export const ITEM_PER_PAGE = 10;

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin"],
  "/staff(.*)": ["admin", "staff"],
  "/family(.*)": ["family"],
  "/list/residents": ["admin", "staff"],
  "/list/family-members": ["admin", "staff"],
  "/list/rooms": ["admin", "staff"],
  "/list/care-plans": ["admin", "staff"],
  "/list/medical-records": ["admin", "staff"],
  "/list/events": ["admin", "staff", "family"],
  "/list/announcements": ["admin", "staff", "family"],
};
