export interface SearchCardProps {
  query: string;
  placeholder: string;
  loading: boolean;
  onQueryChange: (text: string) => void;
  onSearch: () => void;
}
