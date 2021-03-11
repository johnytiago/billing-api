import { Framework } from "hollywood-js";
import { testParameters } from "../config/paramaters-test";
import { parameters } from "../config/parameters";
import {TransactionModule} from "./Billing/Transaction/Infrastructure/TransactionModule";

export default async function KernelFactory(debug: boolean): Promise<Framework.Kernel> {
     return Framework.Kernel.createFromModuleContext(
        process.env.NODE_ENV,
        debug,
        parameters,
        TransactionModule,
        testParameters,
    );
}
