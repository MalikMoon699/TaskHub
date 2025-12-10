
export const landingPageButton = (authAllow) => {
  if (authAllow) {
    return { title: "Get Started", nav: "/dashboard", padding: "9px 20px" };
  } else {
    return { title: "Login", nav: "/login", padding: "7px 32px" };
  }
};
