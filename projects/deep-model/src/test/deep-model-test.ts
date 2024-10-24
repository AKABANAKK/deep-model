import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {DefaultUserProfile, Tag} from './data.spec';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {deepModel} from '../lib/deep-model';

@Component({
    selector: 'deep-model-test',
    standalone: true,
    imports: [RouterOutlet, FormsModule, CommonModule],
    templateUrl: './deep-model-test.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeepModelTest {

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
