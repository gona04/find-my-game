export interface SearchCardProps {
  query: string;
  placeholder: string;
  loading: boolean;

  onChangeText: (text: string) => void;
  onSearch: () => void;
}