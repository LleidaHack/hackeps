export const mockEventService = {
  getHackeps: jest.fn().mockResolvedValue({
    id: 1,
    name: "HackEPS 2026",
    description: "Hackeps 2026",
    start_date: "2026-11-28T13:00:26.478000",
    end_date: "2026-11-29T19:12:26.478000",
    location: "EPS",
    archived: false,
    is_open: true,
    price: 0,
    max_participants: 150,
    max_group_size: 4,
    max_sponsors: 10,
    image: "string",
  }),
  getEventIsHackerRegistered: jest.fn().mockResolvedValue({
    success: true,
  }),
};
