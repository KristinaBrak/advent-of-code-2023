import first from './1';
import second from './2';
import third from './3';
import fourth from './4';
import fifth from './5';
import sixth from './6';
// import seventh from './7';

(() => {
    switch (process.env.TASK) {
        case '1':
            first();
            return;
        case '2':
            second();
            return;
        case '3':
            third();
            return;
        case '4':
            fourth();
            return;
        case '5':
            fifth();
            return;
        case '6':
            sixth();
            return;
        default:
            console.log('No such task');
            return;
    }
})();