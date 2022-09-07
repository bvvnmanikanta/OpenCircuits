import type {Action}                 from "core/actions/Action";
import type {DigitalCircuitDesigner} from "digital/models/DigitalCircuitDesigner";
import type {ICData}                 from "digital/models/ioobjects/other/ICData";


export class DeleteICDataAction implements Action {
    private readonly data: ICData;
    private readonly target: DigitalCircuitDesigner;

    public constructor(data: ICData, target: DigitalCircuitDesigner) {
        this.data = data;
        this.target = target;
    }

    public execute(): Action {
        this.target.removeICData(this.data);
        return this;
    }

    public undo(): Action {
        this.target.addICData(this.data);
        return this;
    }

    public getName(): string {
        return "Deleted IC Data"
    }
}
