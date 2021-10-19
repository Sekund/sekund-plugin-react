import withConnectionStatus from "@/ui/withConnectionStatus";
import React from "react";

const SekundHomeComponent = () => {

  return (<div>And here you will see the user's list of published notes</div>)

}

type Props = {
  view: { addAppDispatch: Function }
}

export default ({ view }: Props) => withConnectionStatus(view, SekundHomeComponent)