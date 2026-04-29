interface KoboResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: KoboResults[];
}