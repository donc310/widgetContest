<template>
<b-container fluid>
    <b-row>
    <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Filter" class="mb-0">
        <b-input-group>
            <b-form-input v-model="filter" placeholder="Search"></b-form-input>
            <b-input-group-append>
            <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
        </b-input-group>
        </b-form-group>
    </b-col>
    </b-row>
    <b-table
    caption-top
    responsive 
    show-empty
    stacked="md"
    :items="computedsummary"
    :fields="fields"
    :current-page="currentPage"
    :per-page="perPage"
    :filter="filter"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    :sort-direction="sortDirection"
    @filtered="onFiltered"
    >
    <template slot="table-caption">Audience summary</template>
    <template slot="actions" slot-scope="row">
        <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
            Info
        </b-button>
    </template>
    <template slot="empty" slot-scope="scope">
    <h4>{{ scope.emptyText }}</h4>
    </template>
    <template slot="emptyfiltered" slot-scope="scope">
    <h4>{{ scope.emptyFilteredText }}</h4>
    </template>
    </b-table>
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
    <pre>{{ infoModal.content }}</pre>
    </b-modal>
</b-container>
</template>

<script>
export default {
    props:{
        _summary:{type:Array , default:[]}
    },
    data() {
    return {
        fields: [
        { key: 'SN',  sortable: true, sortDirection: 'desc' },
        { key: 'state',  sortable: true, },
        { key: 'state_code', sortable:true, class:'text-center' },
        { key: 'audience_total', sortable:true, class:'text-center'},
        { key: 'actions', label: 'Actions' }

        ],
        totalRows: 1,
        currentPage: 1,
        perPage: 0,
        pageOptions: [10, 15],
        sortBy: null,
        sortDesc: false,
        sortDirection: 'asc',
        filter: null,
        infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
        }
    }
    },
    computed: {
    sortOptions() {
        return this.fields
        .filter(f => f.sortable)
        .map(f => {
            return { text: f.label, value: f.key }
        })
    },
    computedsummary(){
        if(this._summary.length === 0 ){return []};
        return this._summary.map((item, index)=>{
            return {SN:index+1,state:item.map.name,state_code:item.map.abv,audience_total:item.count}
        },0);
    },
    
    },
    mounted() {
    this.totalRows = this.computedsummary.length
    },
    methods: {
    info(item, index, button) {
        this.infoModal.title = `Row index: ${index}`
        this.infoModal.content = JSON.stringify(item, null, 2)
        this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal() {
        this.infoModal.title = ''
        this.infoModal.content = ''
    },
    onFiltered(filteredItems) {
        this.totalRows = filteredItems.length
        this.currentPage = 1
    }
    }
}
</script>