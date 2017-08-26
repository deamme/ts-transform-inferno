function MyComponent(props) {
  return (
    <div>
      <span>
        {props.name}
      </span>
      <MyComponent />
      <div>
        {props.children.map(child =>
          <div>
            {child}
          </div>
        )}
      </div>
    </div>
  );
}
