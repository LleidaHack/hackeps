import className from "classnames";

const Button = (props) => {
  const classes = className(`py-2 px-3 duration-300 ${props.className}`, {
    "text-secondaryHackeps bg-primaryHackeps hover:bg-blueSea":
      props.primary && !props.outline && !props.orange,
    "text-[#2e2e2e] bg-[#ff7430] hover:bg-[#ff8a52]":
      props.orange && !props.outline,
    "text-secondaryHackeps bg-secondaryLanding hover:bg-secondaryLanding":
      props.secondaryLanding && !props.outline,
    "text-secondaryHackeps bg-primaryLanding hover:bg-primaryLanding":
      props.primaryLanding && !props.outline && !props.orange,
    "text-gray-CTALanding bg-lightHackeps hover:bg-grayLightHackeps":
      props.light,
    "bg-primaryHackeps hover:text-primaryHackeps hover:bg-secondaryHackeps border-solid border-2 border-secondaryHackeps":
      props.outline && props.primary,
    "bg-secondaryHackeps text-primaryHackeps hover:text-secondaryHackeps hover:bg-primaryHackeps border-solid border-2 border-primaryHackeps":
      props.outline && props.secondary,
    "bg-grayLightHackeps": props.disabled,
    "bg-red-500 hover:bg-red-400": props.delete,
    "rounded-md": props.rounded,
    "text-xs": props.xs,
    "text-sm": props.sm,
    "text-lg": props.lg,
    "text-xl": props.xl,
    "text-2xl": props.xxl,
    "text-3xl": props.xxxl,
  });
  return (
    <button
      // Browsers default a typeless <button> to "submit"; inside a form that
      // reloads the page with every field in the URL. Submit buttons say so.
      type={props.type || "button"}
      onClick={props.onClick}
      className={classes}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
