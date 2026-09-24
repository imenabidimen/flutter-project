import 'package:flutter_test/flutter_test.dart';
import 'package:pocket_ledger/main.dart';
void main(){testWidgets('shows empty state and adds an expense',(tester)async{await tester.pumpWidget(const PocketLedgerApp());expect(find.text('No expenses yet'),findsOneWidget);await tester.tap(find.text('Expense'));await tester.pump();expect(find.text('Coffee'),findsOneWidget);expect(find.text(r'\$3.50'),findsOneWidget);});}
