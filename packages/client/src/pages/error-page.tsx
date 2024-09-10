import { useRouteError } from "react-router-dom";
import classes from "./error-page.module.css";
import { z } from "zod";

const errorSchema = z.object({
  statusText: z.string().optional(),
  message: z.string().optional(),
});

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  const parsedError = errorSchema.parse(error);
  return (
    <div className={classes["error-page"]}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{parsedError.statusText || parsedError.message}</i>
      </p>
    </div>
  );
}
