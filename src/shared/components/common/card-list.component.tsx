type Props<T> = {
  data: T[];
  Component: React.ComponentType<T>;
};

export function CardList<T>({ data, Component }: Props<T>) {
  return (
    <>
      {data.map((item, index) => (
        <Component key={index} {...item} />
      ))}
    </>
  );
}
