import { IBaseAction, BaseAction } from './BaseAction';

class StateStore {
    private ActionHub: Map<string, IBaseAction>;

    public constructor() {
        this.ActionHub = new Map();
    }

    public Get(name: string) {
        let action = this.ActionHub.get(name);

        return action;
    }

    public Regist<T>(name: string) {
        let action;

        if (!this.ActionHub.has(name)) {
            action = new BaseAction<T>();
            this.ActionHub.set(name, action);
        } else {
            action = this.ActionHub.get(name);
        }

        return action;
    }
}

export default new StateStore();
