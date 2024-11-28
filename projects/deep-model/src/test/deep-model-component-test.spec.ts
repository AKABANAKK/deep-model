import {TestBed} from '@angular/core/testing';
import {DeepModelComponentTest} from './deep-model-component-test';
import {TagManager} from './deep-model-test-data';

describe('deep-model-component-test', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DeepModelComponentTest],
        }).compileComponents();
    });

    it('should create the test', () => {
        const fixture = TestBed.createComponent(DeepModelComponentTest);
        const test = fixture.componentInstance;
        expect(test).toBeTruthy();
    });

    it('should update the property when name input changes', () => {
        const fixture = TestBed.createComponent(DeepModelComponentTest);
        fixture.detectChanges();

        const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('#nameInput');
        const test = fixture.componentInstance;

        inputElement.value = 'Kenji';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(test.userProfile().name).toBe('Kenji');
    });

    it('should update the property when street input changes', () => {
        const fixture = TestBed.createComponent(DeepModelComponentTest);
        fixture.detectChanges();

        const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('#streetInput');
        const test = fixture.componentInstance;

        inputElement.value = 'Meiji';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(test.userProfile.address.street()).toBe('Meiji');
    });

    it('should update the property when tag input changes', () => {
        const fixture = TestBed.createComponent(DeepModelComponentTest);
        fixture.detectChanges();

        const button: HTMLButtonElement = fixture.nativeElement.querySelector('#tagAddButton');
        const test = fixture.componentInstance;

        button.dispatchEvent(new Event('click'));
        button.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        expect(test.userProfile.tags()).toEqual([TagManager, {name: 'test2'}, {name: 'test3'}]);
    });
});
