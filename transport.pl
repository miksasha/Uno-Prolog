%Tree = avl_tree(5, avl_tree(3, avl_tree(1, empty_avl_tree, empty_avl_tree, 1), empty_avl_tree, 2), avl_tree(7, avl_tree(6, empty_avl_tree, empty_avl_tree, 1), avl_tree(8, empty_avl_tree, empty_avl_tree, 1), 2), 3), avl_max(Tree, Max).
%Tree = avl_tree(5, avl_tree(3, avl_tree(1, empty_avl_tree, empty_avl_tree, 1), empty_avl_tree, 2), avl_tree(7, avl_tree(6, empty_avl_tree, empty_avl_tree, 1), avl_tree(8, empty_avl_tree, empty_avl_tree, 1), 2), 3), avl_min(Tree, Min).

%insert_final(1, nil, T1), insert_final(2, T1,T2),insert_final(3, T2, T3), search(T3, 2).

%Tree = avl_tree(5, avl_tree(3, avl_tree(1, empty_avl_tree, empty_avl_tree, 1), empty_avl_tree, 2), avl_tree(7, avl_tree(6, empty_avl_tree, empty_avl_tree, 1), avl_tree(8, empty_avl_tree, empty_avl_tree, 1), 2), 3), avl_max(Tree, Max).
%Tree = avl_tree(5, avl_tree(3, avl_tree(1, empty_avl_tree, empty_avl_tree, 1), empty_avl_tree, 2), avl_tree(7, avl_tree(6, empty_avl_tree, empty_avl_tree, 1), avl_tree(8, empty_avl_tree, empty_avl_tree, 1), 2), 3), avl_min(Tree, Min).

%insert_final(1, nil, T1), insert_final(2, T1,T2),insert_final(3, T2, T3), search(T3, 2).
%insert_final(1, nil, T1), insert_final(2, T1,T2),insert_final(3, T2, T3), insert_final(50,T3,T4),insert_final(40,T4,T5),insert_final(30,T5,T6),insert_final(20,T6,T0).
%insert_final(1, nil, T1), insert_final(2, T1,T2),insert_final(3, T2, T3), insert_final(50,T3,T4),insert_final(40,T4,T5),insert_final(30,T5,T6),insert_final(20,T6,T0), delete(40, T0, REsult).


% Find the minimum value in an AVL tree
% Find the minimum value in an AVL tree
avl_min(avl_tree(Value, empty_avl_tree, _, _), Value).
avl_min(avl_tree(_, Left, _, _), Min) :-
    avl_min(Left, Min).
avl_min(avl_tree(_, _, Right, _), Min) :-
    avl_min(Right, Min).
% Find the maximum value in an AVL tree
avl_max(avl_tree(Value, _, empty_avl_tree, _), Value).
avl_max(avl_tree(_, _, _, Right), Max) :-
    avl_max(Right, Max).
avl_max(avl_tree(_, _, Left, _), Max) :-
    avl_max(Left, Max).

% AVL Tree with insert only
search(nil, _) :-
    fail.
search(t(Key, _, _, _), Key) :-
    !.
search(t(Key, Left, _, _), SearchKey) :-
    SearchKey < Key,
    search(Left, SearchKey).
search(t(_, _, Right, _), SearchKey) :-
    search(Right, SearchKey).
% An empty AVL tree is represented as nil.
% An AVL tree with a node and two subtrees is represented as t(Value, Left, Right).
% The height of an AVL tree is stored in the root node.
insert_final(Value, t(Root, Left, Right, Height), Result) :-
    insert(Value, t(Root, Left, Right, Height), NewTree),
    balance(NewTree, Result).
insert_final(Value, nil, Result) :-
    insert(Value, nil, Result).
% insert(+Value, +Tree, -NewTree)
% Insert a value into an AVL tree.
insert(Value, nil, t(Value, nil, nil, 1)).
insert(Value, t(Root, Left, Right, Height), NewTree) :-
    Value < Root,
    insert(Value, Left, NewLeft),
    update_height(t(Root, NewLeft, Right, Height), NewTree).
insert(Value, t(Root, Left, Right, Height), NewTree) :-
    Value > Root,
    insert(Value, Right, NewRight),
    update_height(t(Root, Left, NewRight, Height), NewTree).
insert(_, Tree, Tree).

% update_height(+Tree, -NewTree)
% Update the height of a tree based on the heights of its subtrees.
update_height(t(Root, Left, Right, _), t(Root, Left, Right, NewHeight)) :-
    height(Left, LeftHeight),
    height(Right, RightHeight),
    max(LeftHeight, RightHeight, MaxHeight),
    NewHeight is MaxHeight + 1.

% height(+Tree, -Height)
% Calculate the height of a tree.
height(nil, 0).
height(t(_, Left, Right, Height), TreeHeight) :-
    height(Left, LeftHeight),
    height(Right, RightHeight),
    max(LeftHeight, RightHeight, MaxHeight),
    TreeHeight is MaxHeight + 1.
max(X, Y, X) :- X >= Y.
max(X, Y, Y) :- X < Y.


% is_avl(+Tree)



% balance_left(+Tree, -NewTree)
% Balances a left-heavy subtree by performing rotations as necessary.
balance_left(nil, nil).
balance_left(t(Root, Left, Right, _), NewTree) :-
    height(Left, LeftHeight),
    height(Right, RightHeight),
    Diff is LeftHeight - RightHeight,
    (Diff > 0 ->
        % Left subtree of left subtree is too high
        rotate_right(t(Root, Left, Right, 0), TempTree),
        update_height(TempTree, NewTree)
    ;
        % Right subtree of left subtree is too high or already balanced
        update_height(t(Root, Left, Right, 0), NewTree)
    ).

    % balance_right(+Tree, -NewTree)
    % Balances a right-heavy subtree by performing rotations as necessary.
    balance_right(nil, nil).
    balance_right(t(Root, Left, Right, _), NewTree) :-
        height(Left, LeftHeight),
        height(Right, RightHeight),
        Diff is LeftHeight - RightHeight,
        (Diff < 0 ->
            % Right subtree of right subtree is too high
            rotate_left(t(Root, Left, Right, 0), TempTree),
            update_height(TempTree, NewTree)
        ;
            % Left subtree of right subtree is too high or already balanced
            update_height(t(Root, Left, Right, 0), NewTree)
        ).

    % rotate_left(+Tree, -NewTree)
    rotate_left(t(Root, Left, t(RootRight, RightLeft, RightRight, _), _), Result) :-
        height(Left, LeftHeight),
        height(RightLeft, RightLeftHeight),
        NewLeftHeight is max(LeftHeight, RightLeftHeight) + 1,
        Result = t(RootRight, t(Root, Left, RightLeft, NewLeftHeight), RightRight, NewLeftHeight).

    % rotate_right(+Tree, -NewTree)
    % Performs a right rotation on an AVL tree.
    rotate_right(t(Root, t(RootLeft, LeftLeft, LeftRight, _), Right, _), Result) :-
        height(Right, RightHeight),
        height(LeftRight, LeftRightHeight),
        NewRightHeight is max(RightHeight, LeftRightHeight) + 1,
        Result = t(RootLeft, LeftLeft, t(Root, LeftRight, Right, NewRightHeight), NewRightHeight).
                   % left_right(+Tree, -NewTree)
    % Rotate the tree to the left, then to the right.
    rotate_left_right(t(Root, Left, Right, _), NewTree) :-
        rotate_left(Left, TempTree),
        update_height(t(Root, TempTree, Right, _), TempTree2),
        rotate_right(TempTree2, NewTree).
    % right_left(+Tree, -NewTree)
    % Rotate the tree to the right, then to the left.
    rotate_right_left(t(Root, Left, t(RightRoot, RightLeft, RightRight, _), _), NewTree) :-
        rotate_right(t(RightRoot, RightLeft, RightRight, _), TempTree),
        update_height(t(Root, Left, TempTree, _), TempTree2),
        rotate_left(TempTree2, NewTree).
    % delete(+Value, +Tree, -NewTree)
    % Delete a value from an AVL tree.
    delete(Value, t(Value, Left, Right, _), NewTree) :-
        delete_root(Value, Left, Right, NewTree).
    delete(Value, t(Root, Left, Right, Height), NewTree) :-
        Value < Root,
        delete(Value, Left, NewLeft),
        update_height(t(Root, NewLeft, Right, Height), TempTree),
        balance(TempTree, NewTree).
    delete(Value, t(Root, Left, Right, Height), NewTree) :-
        Value > Root,
        delete(Value, Right, NewRight),
        update_height(t(Root, Left, NewRight, Height), TempTree),
        balance(TempTree, NewTree).
    delete(_, Tree, Tree).

    % delete_root(+Value, +Left, +Right, -NewTree)
    % Delete the root node of an AVL tree.
    delete_root(_, nil, Right, Right).
    delete_root(_, Left, nil, Left).
    delete_root(_, Left, Right, NewTree) :-
        % Both subtrees are non-empty.
        % Replace the root with its in-order predecessor and delete the predecessor.
        max_node(Left, Max, NewLeft),
        update_height(t(Max, NewLeft, Right, _), TempTree),
        balance(TempTree, NewTree).

    % max_node(+Tree, -Max, -NewTree)
    % Find the node with the maximum value in a tree and delete it.
    max_node(t(Value, Left, nil, _), Value, Left) :- !.
    max_node(t(Value, Left, Right, Height), Max, NewTree) :-
        max_node(Right, Max, NewRight),
        update_height(t(Value, Left, NewRight, Height), TempTree),
        balance(TempTree, NewTree).

        balance(t(Root, Left, Right, Height), NewTree) :-
            height(Left, LeftHeight),
            height(Right, RightHeight),
            Diff is LeftHeight - RightHeight,
            (Diff > 1 ->
                % Left subtree is too tall.
                left_subtree(Left, LeftSubtree),
                height(LeftSubtree, LeftLeftHeight),
                right_subtree(Left, LeftRightSubtree),
                height(LeftRightSubtree, LeftRightHeight),
                (LeftLeftHeight >= LeftRightHeight ->
                    % Left-left case.
                    rotate_right(t(Root, Left, Right, Height), NewTree)
                ;
                    % Left-right case.
                    rotate_left_right(t(Root, Left, Right, Height), NewTree)
                )
            ;
            Diff < -1 ->
                % Right subtree is too tall.
                right_subtree(Right, RightSubtree),
                height(RightSubtree, RightRightHeight),
                left_subtree(Right, RightLeftSubtree),
                height(RightLeftSubtree, RightLeftHeight),
                (RightRightHeight >= RightLeftHeight ->
                    % Right-right case.
                    rotate_left(t(Root, Left, Right, Height), NewTree)
                ;
                    % Right-left case.
                    rotate_right_left(t(Root, Left, Right, Height), NewTree)
                )
            ;
                % Tree is balanced.
                NewTree = t(Root, Left, Right, Height)
            ).

        % leftsubtree(+Tree, -Subtree)
        % Extracts the left subtree from a given AVL tree.
        left_subtree(t(_, Left, _, _), Left).

        % rightsubtree(+Tree, -Subtree)
        % Extracts the right subtree from a given AVL tree.
        right_subtree(t(_, _, Right, _), Right).