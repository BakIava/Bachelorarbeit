export class Algorithm {
    q: any[];

    constructor(q: any) {
        this.q = q;
    }

    chooseAction(state: string) {
        const QValue = this.q.find(v => v.state === state);
        const randomIndex = Math.floor(Math.random() * QValue.actionValue.length);

        let max = QValue.actionValue[randomIndex].value;
        let action = QValue.actionValue[randomIndex].action;

        for (const value of QValue.actionValue) {
            if (value.value > max) {
                max = value.value;
                action = value.action;
            }
        }

        return action;
    }

    choosePlaceAction(state: string) {
        const action = this.chooseAction(state);
        return action;
    }

    chooseMoveAction(state: string) {
        const action = this.chooseAction(state);
        return action;
    }
}