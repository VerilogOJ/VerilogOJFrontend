var keywords = 
    "accept_on alias always always_comb always_ff always_latch and assert assign assume automatic before begin bind " +
    "bins binsof bit break buf bufif0 bufif1 byte case casex casez cell chandle checker class clocking cmos config " +
    "const constraint context continue cover covergroup coverpoint cross deassign default defparam design disable " +
    "dist do edge else end endcase endchecker endclass endclocking endconfig endfunction endgenerate endgroup " +
    "endinterface endmodule endpackage endprimitive endprogram endproperty endspecify endsequence endtable endtask " +
    "enum event eventually expect export extends extern final first_match for force foreach forever fork forkjoin " +
    "function generate genvar global highz0 highz1 if iff ifnone ignore_bins illegal_bins implements implies import " +
    "incdir include initial inout input inside instance int integer interconnect interface intersect join join_any " +
    "join_none large let liblist library local localparam logic longint macromodule matches medium modport module " +
    "nand negedge nettype new nexttime nmos nor noshowcancelled not notif0 notif1 null or output package packed " +
    "parameter pmos posedge primitive priority program property protected pull0 pull1 pulldown pullup " +
    "pulsestyle_ondetect pulsestyle_onevent pure rand randc randcase randsequence rcmos real realtime ref reg " +
    "reject_on release repeat restrict return rnmos rpmos rtran rtranif0 rtranif1 s_always s_eventually s_nexttime " +
    "s_until s_until_with scalared sequence shortint shortreal showcancelled signed small soft solve specify " +
    "specparam static string strong strong0 strong1 struct super supply0 supply1 sync_accept_on sync_reject_on " +
    "table tagged task this throughout time timeprecision timeunit tran tranif0 tranif1 tri tri0 tri1 triand trior " +
    "trireg type typedef union unique unique0 unsigned until until_with untyped use uwire var vectored virtual void " +
    "wait wait_order wand weak weak0 weak1 while wildcard wire with within wor xnor xor"

var arr = keywords.split(' ');

class Treenode {
    constructor(key,leaf){
      this.key = key;
      this.leaf = leaf;
      this.count = 0;
      if(!leaf){
        this.children = [];
      }
        this.candidate_list_temp = [];
    }
  }
  class Tree{
    constructor(){
      var root = new Treenode(null,false);
      this.root = root;
    }
    run(strs){
      var root = this.root;
        for (let i = 0; i < strs.length; i++){
          this.insertNode(root,strs[i]);
      }
    }
    
    insertNode(node,str){
      if(!node.leaf){
    
        var child = node.children.find(function(child){
          return child.key == str[0];
        });
        if(child){
          child.count++;

          this.insertNode(child,str.substring(1));
        }else{
            if(str.length==1){
              var child = new Treenode(str[0],true);
            }else{
              var child = new Treenode(str[0],false)
            }
            node.children.push(child);
            this.insertNode(child,str.substring(1));
        }
      }
      
    }
    
    search(txt){
        if(!txt){
            return [false, null];
        }
        var cur = this.root;
        for (var i = 0; i < txt.length; i++) {
            var child = cur.children.find(function (child) {
                return child.key == txt[i];
            });
            if (!child) return false;
            cur = child;
        }
        return [true, cur]
    }
      
    get_candidate_dfs(x, word, depth) {
        if (x.leaf && depth > 0) {
            self.candidate_list_temp.push(word);
            return
        } 
        if(x.children)
        for (var c of x.children) {
            this.get_candidate_dfs(c, word + c.key, depth + 1);   
        }
    }
    
    get_candidate(x, word) {
        self.candidate_list_temp = []
        this.get_candidate_dfs(x, word, 0);
        return self.candidate_list_temp;
    }

    getRoot(){
      return this.root;
    }
  }
  
var keyword_tree = new Tree();
keyword_tree.run(arr);

//var node = keyword_tree.search('a')
//console.log(keyword_tree.get_candidate(node[1], 'a'));

export { keyword_tree }