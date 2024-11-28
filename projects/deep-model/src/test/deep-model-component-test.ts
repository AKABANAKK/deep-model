import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DefaultUserProfile, Tag} from './deep-model-test-data';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {deepModel} from '../lib/deep-model';

@Component({
    selector: 'deep-model-component-test',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './deep-model-component-test.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeepModelComponentTest {

    readonly userProfile = deepModel(DefaultUserProfile);

    constructor() {
    }

    add_tag() {
        const tags = this.userProfile.tags() ?? [];
        let tagCount = tags.length;
        const newValue = 'test' + ++tagCount;
        const newTag: Tag = {name: newValue};
        this.userProfile.tags.set([...tags, newTag]);
    }
}
